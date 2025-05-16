import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WorkoutEntity } from './workout.entity';
import { Repository } from 'typeorm';
import { renameMuscleGroupMap } from '../../../../../libs/interfaces/MuscleGroup';
import { Workout } from '../../../../../libs/interfaces/workout';
import { CustomBadRequestException } from '../exceptions/CustomBadRequestException';
import { ErrorCode } from '../../../../../libs/error-code/error-code';

@Injectable()
export class WorkoutService {


    constructor(
        @InjectRepository(WorkoutEntity)
        private readonly workoutRepository: Repository<WorkoutEntity>
    ) {
    }

    async create(workout: Workout, forceCreateWorkout = false) {
        const existingWorkoutToday = await this.workoutRepository
            .createQueryBuilder('w')
            .where('w.muscleGroup.id = :muscleGroupId', { muscleGroupId: workout.muscleGroup.id })
            .andWhere('DATE(w.date) = DATE(:date)', { date: workout.date })
            .getOne();


        if (existingWorkoutToday && !forceCreateWorkout) {
            throw new CustomBadRequestException(ErrorCode.duplicateWorkout, 'Vous avez déjà réalisé cette séance aujourd’hui.');
        }
        return this.workoutRepository.save(workout);
    }

    async findByUserId(userId: number) {
        const workout = await this.workoutRepository.find({
            where: {
                user: {
                    id: userId
                }
            }
        });

        workout.forEach(w => {
            w.muscleGroup.name = renameMuscleGroupMap[w.muscleGroup.name] ?? w.muscleGroup.name;
        });

        return workout;
    }


    async delete(userId: number, id: number) {
        const historyToDelete = await this.workoutRepository.findOne({
            where: {
                id,
                user: {
                    id: userId
                }
            }
        });

        await this.workoutRepository.delete({ id: historyToDelete.id });

        return { deletedId: id };
    }
}
