import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserExerciseEntity } from './user-exercise.entity';
import { Repository } from 'typeorm';
import { UserExercise } from '../interfaces/user-exercise';

@Injectable()
export class UserExerciseService {

    constructor(
        @InjectRepository(UserExerciseEntity)
        private readonly userExerciseEntityRepository: Repository<UserExerciseEntity>
    ) {
    }

    async create(userExercise: UserExercise) {
        const existingUserExercise = await this.userExerciseEntityRepository.findOne({
            where: {
                user: {
                    id: userExercise.user.id
                },
                exercise: {
                    id: userExercise.exercise.id
                }
            }
        });
        if (existingUserExercise) {
            return this.userExerciseEntityRepository.remove(existingUserExercise);
        }

        return this.userExerciseEntityRepository.save(userExercise);
    }

    async updateOrderExercises(userExercises: UserExercise[]) {
        for (const ue of userExercises) {
            await this.userExerciseEntityRepository.update(ue.id, {
                order: ue.order
            });
        }

        return userExercises;
    }
}
