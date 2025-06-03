import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { MuscleGroupService } from '../muscle-group/muscle-group.service';
import { CustomBadRequestException } from '../exceptions/CustomBadRequestException';
import { ErrorCode } from '../../../../../libs/error-code/error-code';
import { ExercisesEntity } from './exercises.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../../../libs/interfaces/user';
import { Exercise } from '../../../../../libs/interfaces/exercise';

@Injectable()
export class ExercisesService {
    constructor(
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

        if (user?.id) {
            const exercises: Exercise[] = await this.exerciseRepository
                .createQueryBuilder('e')
                .select([
                    'e.id AS id',
                    'e.name AS name',
                    'e.description AS description',
                    'CASE WHEN ue.id IS NOT NULL THEN true ELSE false END AS "addedToWorkout"',
                    'ARRAY_AGG(DISTINCT m.name) AS "muscles"',
                    'ue.id as "userExerciseId"',
                    'ue.order as "order"'
                ])
                .leftJoin('e.userExercise', 'ue', 'ue.user_id = :userId', { userId: user.id })
                .innerJoin('e.exerciseMuscle', 'em')
                .innerJoin('em.muscle', 'm')
                .innerJoin('m.muscleGroup', 'mg')
                .where('mg.id = :muscleGroupId', { muscleGroupId })
                .groupBy('e.id, e.name, e.description, ue.id')
                .getRawMany();


            return {
                exercises,
                muscleGroup: await this.muscleGroupService.findById(muscleGroupId)
            };
        } else {
            const exercises: Exercise[] = await this.exerciseRepository
                .createQueryBuilder('e')
                .select([
                    'e.id AS id',
                    'e.name AS name',
                    'e.description AS description',
                    'ARRAY_AGG(DISTINCT m.name) AS "muscles"'
                ])
                .innerJoin('e.exerciseMuscle', 'em')
                .innerJoin('em.muscle', 'm')
                .innerJoin('m.muscleGroup', 'mg')
                .where('mg.id = :muscleGroupId', { muscleGroupId })
                .groupBy('e.id, e.name, e.description')
                .addOrderBy('e.id', 'ASC')
                .getRawMany();

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
                'DISTINCT e.id AS id',
                'e.name AS name',
                'e.description AS description',
                'e.isSmartWorkout AS "isSmartWorkout"',
                'ue.order as order'
            ])
            .where('ue.user.id = :userId', { userId })
            .andWhere('mg.id = :muscleGroupId', { muscleGroupId })
            .orderBy('ue.order', 'ASC')
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

    getExercise(exerciseId: number, user?: User) {
        if (user?.id) {
            return this.exerciseRepository.createQueryBuilder('e')
                .select([
                    'e.id as "id"',
                    'e.name as "name"',
                    'e.description as "description"',
                    'e.isSmartWorkout as "isSmartWorkout"',
                    'CASE WHEN ue.id IS NOT NULL THEN TRUE ELSE FALSE END as "addedToWorkout"',
                    'ARRAY_AGG(DISTINCT m.name) AS "muscles"'
                ])
                .leftJoin('e.userExercise', 'ue', 'ue.user_id = :userId', { userId: user.id })
                .leftJoin('e.exerciseMuscle', 'em')
                .leftJoin('em.muscle', 'm')
                .leftJoin('m.muscleGroup', 'mg')
                .where('e.id = :exerciseId', { exerciseId })
                .groupBy('e.id, ue.id')
                .getRawOne();
        } else {
            return this.exerciseRepository.createQueryBuilder('e')
                .select([
                    'e.id as "id"',
                    'e.name as "name"',
                    'e.description as "description"',
                    'e.isSmartWorkout as "isSmartWorkout"',
                    'ARRAY_AGG(DISTINCT m.name) AS "muscles"'
                ])
                .leftJoin('e.exerciseMuscle', 'em')
                .leftJoin('em.muscle', 'm')
                .leftJoin('m.muscleGroup', 'mg')
                .where('e.id = :exerciseId', { exerciseId })
                .groupBy('e.id')
                .getRawOne();
        }
    }
}
