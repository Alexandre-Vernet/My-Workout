import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WorkoutEntity } from './workout.entity';
import { Repository } from 'typeorm';
import { renameMuscleGroupMap } from '../../../../../libs/interfaces/MuscleGroup';

@Injectable()
export class WorkoutService {


    constructor(
        @InjectRepository(WorkoutEntity)
        private readonly workoutRepository: Repository<WorkoutEntity>
    ) {
    }

    async getWorkoutFromUserId(userId: number) {
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
