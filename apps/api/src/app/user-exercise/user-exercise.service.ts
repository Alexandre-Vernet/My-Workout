import { Injectable } from '@nestjs/common';
import { UserExercise } from '../../../../../libs/interfaces/user-exercise';
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

    async create(userExercise: UserExercise) {
        if (!userExercise?.user?.id || !userExercise?.exercise?.id) {
            throw new CustomBadRequestException(ErrorCode.userMustBeLoggedToContinue, 'Vous devez être connecté pour continuer');
        } else {
            const existingWorkout = await this.workoutRepository.findOne({
                where: {
                    user: {
                        id: userExercise.user.id
                    },
                    exercise: {
                        id: userExercise.exercise.id
                    }
                }
            });
            if (existingWorkout) {
                return await this.workoutRepository.remove(existingWorkout);
            }

            return await this.workoutRepository.save(userExercise);
        }
    }
}
