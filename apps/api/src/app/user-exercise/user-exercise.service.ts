import { Injectable } from '@nestjs/common';
import { UserExercise } from '../../../../../libs/interfaces/user-exercise';
import { InjectRepository } from '@nestjs/typeorm';
import { UserExerciseEntity } from './user-exercise.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserExerciseService {

    constructor(
        @InjectRepository(UserExerciseEntity)
        private readonly userExerciseEntityRepository: Repository<UserExerciseEntity>
    ) {
    }

    async create(userExercise: UserExercise) {
        const existingWorkout = await this.userExerciseEntityRepository.findOne({
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
            return await this.userExerciseEntityRepository.remove(existingWorkout);
        }

        return await this.userExerciseEntityRepository.save(userExercise);
    }
}
