import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MuscleGroupEntity } from './muscle-group.entity';
import { DataSource, Repository } from 'typeorm';
import { MuscleGroup } from '../../../../../libs/interfaces/MuscleGroup';

@Injectable()
export class MuscleGroupService {
    constructor(
        @InjectRepository(MuscleGroupEntity)
        private readonly muscleGroupRepository: Repository<MuscleGroupEntity>,
        private readonly dataSource: DataSource
    ) {
    }

    checkMuscleGroupIdExist(muscleGroupId: number) {
        return this.muscleGroupRepository.findOne({
            where: {
                id: muscleGroupId
            }
        });
    }

    async findAllMuscleGroupByUserId() {
        return this.dataSource.query(`
            select mg.id, mg.name
            from muscle_group mg
                     left join muscles m on m.muscle_group_id = mg.id
                     left join exercise_muscle em on em.muscle_id = m.id
                     left join exercises e on e.id = em.exercise_id
            group by mg.id, mg.name
            order by mg.id
        `);
    }

    async findAllMuscleGroupAndCountExercisesByUserId(userId: number) {
        const muscleGroup: MuscleGroup[] = await this.dataSource.query(`
            select mg.id, mg.name, COUNT(distinct ue.exercise_id) as "exerciseCount"
            from muscle_group mg
                     left join muscles m on m.muscle_group_id = mg.id
                     left join exercise_muscle em on em.muscle_id = m.id
                     left join exercises e on e.id = em.exercise_id
                     LEFT JOIN user_exercise ue ON ue.exercise_id = e.id AND ue.user_id = $1
            group by mg.id, mg.name
        `, [userId]);

        return muscleGroup.map(m => {
            return {
                id: m.id,
                name: m.name,
                exerciseCount: Number(m.exerciseCount)
            };
        });
    }

    findById(muscleGroupId: number) {
        return this.muscleGroupRepository.findOne({
            where: {
                id: muscleGroupId
            }
        });
    }


    async suggestMuscleGroup(userId: number) {
        const result = await this.dataSource.query(
            `
                WITH all_muscle_groups AS (SELECT id, name
                                           FROM muscle_group),
                     worked_groups AS (SELECT DISTINCT mg.id AS muscle_group_id
                                       FROM workout w
                                                JOIN history h ON w.id = h.workout_id
                                                JOIN exercises e ON e.id = h.exercise_id
                                                JOIN exercise_muscle em ON em.exercise_id = e.id
                                                JOIN muscles m ON m.id = em.muscle_id
                                                JOIN muscle_group mg ON mg.id = m.muscle_group_id
                                       WHERE w.user_id = $1),
                     never_done_groups AS (SELECT id, name
                                           FROM all_muscle_groups
                                           WHERE id NOT IN (SELECT muscle_group_id FROM worked_groups)),
                     ranked_worked_groups AS (SELECT mg.id,
                                                     mg.name,
                                                     MAX(h.date) AS last_worked
                                              FROM workout w
                                                       JOIN history h ON w.id = h.workout_id
                                                       JOIN exercises e ON e.id = h.exercise_id
                                                       JOIN exercise_muscle em ON em.exercise_id = e.id
                                                       JOIN muscles m ON m.id = em.muscle_id
                                                       JOIN muscle_group mg ON mg.id = m.muscle_group_id
                                              WHERE w.user_id = $1
                                              GROUP BY mg.id, mg.name)
                SELECT id, name
                FROM ((SELECT id, name
                       FROM never_done_groups
                       ORDER BY random() LIMIT 1)
                      UNION ALL
                      (SELECT id, name
                       FROM ranked_worked_groups
                       ORDER BY last_worked ASC LIMIT 1)) AS combined LIMIT 1;
            `, [userId]
        );

        return result[0];
    }
}
