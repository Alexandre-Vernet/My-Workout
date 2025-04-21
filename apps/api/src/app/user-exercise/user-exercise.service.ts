import { Injectable } from '@nestjs/common';
import { Workout } from '../../../../../libs/interfaces/workout';
import { InjectRepository } from '@nestjs/typeorm';
import { UserExerciseEntity } from './user-exercise.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserExerciseService {

    constructor(
        @InjectRepository(UserExerciseEntity)
        private readonly workoutRepository: Repository<UserExerciseEntity>
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
