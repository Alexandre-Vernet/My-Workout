import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HistoryEntity } from './history.entity';
import { Repository } from 'typeorm';
import { History } from '../../../../../libs/interfaces/history';
import { WorkoutService } from '../workout/workout.service';

@Injectable()
export class HistoryService {

    constructor(
        @InjectRepository(HistoryEntity)
        private readonly historyRepository: Repository<HistoryEntity>,
        private readonly workoutService: WorkoutService
    ) {
    }

    create(history: History) {
        return this.historyRepository.save(history);
    }


    findLastHistoryWeightByExerciseId(userId: number, exerciseId: number) {
        return this.historyRepository
            .createQueryBuilder('h')
            .innerJoin('h.workout', 'w')
            .innerJoin('h.exercise', 'e')
            .where('w.user_id = :userId', { userId })
            .andWhere('e.id = :exerciseId', { exerciseId })
            .andWhere('h.weight IS NOT NULL')
            .orderBy('w.date', 'DESC')
            .addOrderBy('h.weight', 'DESC')
            .getOne();
    }


    existingWorkout(userId: number, muscleGroupId: number, exerciseId: number) {
        return this.historyRepository
            .createQueryBuilder('h')
            .leftJoin('h.exercise', 'e')
            .leftJoin('h.workout', 'w')
            .where('w.user.id = :userId', { userId })
            .andWhere('e.id = :exerciseId', { exerciseId })
            .andWhere('w.muscleGroup.id = :muscleGroupId', { muscleGroupId })
            .andWhere('DATE(w.date) = DATE(:date)', { date: new Date() })
            .orderBy('h.id', 'ASC')
            .getMany();
    }

    update(history: History) {
        if (history.weight === 0) {
            history.weight = null;
        }
        return this.historyRepository.save(history);
    }

    delete(historyId: number) {
        return this.historyRepository.delete(historyId);
    }

    async deleteIds(userId: number, ids: number[]) {
        const historyOne = await this.historyRepository.findOne({
            where: {
                id: ids[0],
                workout: {
                    user: {
                        id: userId
                    }
                }
            },
            relations: {
                workout: true
            }
        });

        await Promise.all(
            ids.map(async id => this.historyRepository.delete({ id }))
        );

        // Delete workout if no history left
        return this.workoutService.deleteWorkoutIfNoHistory(historyOne?.workout?.id);
    }
}
