import { Injectable } from '@nestjs/common';
import { Workout } from '../../../../../libs/interfaces/workout';
import { InjectRepository } from '@nestjs/typeorm';
import { UserExerciseEntity } from './user-exercise.entity';
import { Repository } from 'typeorm';
import { ErrorCode } from '../../../../../libs/error-code/error-code';
import { CustomBadRequestException } from '../exceptions/CustomBadRequestException';

@Injectable()
export class UserExerciseService {

    constructor(
        @InjectRepository(UserExerciseEntity)
        private readonly workoutRepository: Repository<UserExerciseEntity>
    ) {
    }

    async create(workout: Workout) {
        if (!workout?.user?.id || !workout?.exercise?.id) {
            throw new CustomBadRequestException(ErrorCode.userMustBeLoggedToContinue, 'Vous devez être connecté pour continuer');
        } else {
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
                return await this.workoutRepository.remove(existingWorkout);
            }

            return await this.workoutRepository.save(workout);
        }
    }
}
