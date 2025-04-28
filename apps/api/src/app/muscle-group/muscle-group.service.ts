import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MuscleGroupEntity } from './muscle-group.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class MuscleGroupService {
    constructor(
        @InjectRepository(MuscleGroupEntity)
        private readonly muscleGroupRepository: Repository<MuscleGroupEntity>,
        private readonly dataSource: DataSource
    ) {
    }

    async findAllMuscleGroupByUserId(userId: number) {
        const muscleGroup: any[] = await this.dataSource.query(`
            select mg.id, mg.name, COUNT(distinct ue.exercise_id) as exercise_count
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
                exerciseCount: Number(m.exercise_count)
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


    suggestMuscleGroup(userId: number) {
        return this.muscleGroupRepository.createQueryBuilder('muscleGroup')
            .innerJoin('muscleGroup.muscle', 'm')
            .innerJoin('m.exerciseMuscle', 'em')
            .innerJoin('em.exercise', 'e')
            .innerJoin('e.history', 'h')
            .select([
                'muscleGroup.id as id',
                'muscleGroup.name as name'
            ])
            .where('h.user.id = :userId', { userId })
            .groupBy('muscleGroup.id, muscleGroup.name')
            .orderBy('MAX(h.createdAt)', 'ASC')
            .limit(1)
            .getRawOne();
    }
}
