import { Injectable } from '@nestjs/common';
import { Workout } from '../../../../../libs/interfaces/workout';
import { InjectRepository } from '@nestjs/typeorm';
import { WorkoutEntity } from './workout.entity';
import { Repository } from 'typeorm';

@Injectable()
export class WorkoutService {

    constructor(
        @InjectRepository(WorkoutEntity)
        private readonly workoutRepository: Repository<WorkoutEntity>
    ) {
    }

    async create(workout: Workout) {
        const existingWorkout = await this.workoutRepository.findOne({
            where: {
                user: {
                  id: workout.user.id
                },
                exercise: {
                    id: workout.exercise.id
                }
            }
        });
        if (existingWorkout) {
            return this.workoutRepository.remove(existingWorkout);
        }

        return this.workoutRepository.save(workout);
    }
}
