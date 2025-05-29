import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { MuscleGroupService } from '../muscle-group/muscle-group.service';
import { CustomBadRequestException } from '../exceptions/CustomBadRequestException';
import { ErrorCode } from '../../../../../libs/error-code/error-code';
import { ExercisesEntity } from './exercises.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../../../libs/interfaces/user';

@Injectable()
export class ExercisesService {
    constructor(
        private readonly dataSource: DataSource,
        @InjectRepository(ExercisesEntity)
        private readonly exerciseRepository: Repository<ExercisesEntity>,
        private readonly muscleGroupService: MuscleGroupService
    ) {
    }

    async findAllExercisesByMuscleGroupId(muscleGroupId: number, user?: User) {
        const muscleGroupExist = await this.muscleGroupService.checkMuscleGroupIdExist(muscleGroupId);
        if (!muscleGroupExist) {
            throw new CustomBadRequestException(ErrorCode.muscleGroupDoesntExist);
        }

        if (user && user.id) {
            const exercises = await this.dataSource.query(
                `
                    SELECT e.id,
                           e.name,
                           e.description,
                           CASE
                               WHEN ue.id IS NOT NULL THEN true
                               ELSE false
                               END                           AS "addedToWorkout",
                           STRING_AGG(DISTINCT m.name, ', ') AS "muscleGroup"
                    FROM exercises e
                             LEFT JOIN user_exercise ue ON
                        e.id = ue.exercise_id AND ue.user_id = $1
                             JOIN exercise_muscle em ON
                        em.exercise_id = e.id
                             JOIN muscles m ON
                        em.muscle_id = m.id
                             JOIN muscle_group mg ON m.muscle_group_id = mg.id
                    WHERE m.muscle_group_id = $2
                    GROUP BY e.id, e.name, e.description, ue.id;
                `,
                [user.id, muscleGroupId]
            );

            return {
                exercises,
                muscleGroup: await this.muscleGroupService.findById(muscleGroupId)
            };
        } else {
            const exercises = await this.dataSource.query(
                `
                    SELECT e.id,
                           e.name,
                           e.description,
                           STRING_AGG(DISTINCT m.name, ', ') AS "muscleGroup"
                    FROM exercises e
                             JOIN exercise_muscle em ON
                        em.exercise_id = e.id
                             JOIN muscles m ON
                        em.muscle_id = m.id
                             JOIN muscle_group mg ON m.muscle_group_id = mg.id
                    WHERE m.muscle_group_id = $1
                    GROUP BY e.id, e.name, e.description;
                `,
                [muscleGroupId]
            );
            return {
                exercises,
                muscleGroup: await this.muscleGroupService.findById(muscleGroupId)
            };
        }
    }

    async findAddedExercisesByMuscleGroupId(userId: number, muscleGroupId: number) {
        const muscleGroupExist = await this.muscleGroupService.checkMuscleGroupIdExist(muscleGroupId);
        if (!muscleGroupExist) {
            throw new CustomBadRequestException(ErrorCode.muscleGroupDoesntExist);
        }

        return this.exerciseRepository
            .createQueryBuilder('e')
            .leftJoin('e.userExercise', 'ue')
            .innerJoin('e.exerciseMuscle', 'em')
            .innerJoin('em.muscle', 'm')
            .innerJoin('m.muscleGroup', 'mg')
            .select([
                'e.id AS id',
                'e.name AS name',
                'e.description AS description',
                'e.isSmartWorkout AS "isSmartWorkout"'
            ])
            .where('ue.user.id = :userId', { userId })
            .andWhere('mg.id = :muscleGroupId', { muscleGroupId })
            .getRawMany();
    }

    findCardioExercises(userId: number) {
        return this.exerciseRepository.find({
            where: {
                userExercise: {
                    user: {
                        id: userId
                    },
                    exercise: {
                        exerciseMuscle: {
                            muscle: {
                                muscleGroup: {
                                    id: 8,
                                    name: 'Cardio'
                                }
                            }
                        }
                    }
                }
            }
        });
    }
}
