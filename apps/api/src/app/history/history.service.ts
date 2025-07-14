import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HistoryEntity } from './history.entity';
import { In, Repository } from 'typeorm';
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
        if (history.weight === 0) {
            history.weight = null;
        }
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
        const twelveHoursAgo = new Date();
        twelveHoursAgo.setHours(twelveHoursAgo.getHours() - 12);

        return this.historyRepository
            .createQueryBuilder('h')
            .leftJoin('h.exercise', 'e')
            .leftJoin('h.workout', 'w')
            .where('w.user.id = :userId', { userId })
            .andWhere('e.id = :exerciseId', { exerciseId })
            .andWhere('w.muscleGroup.id = :muscleGroupId', { muscleGroupId })
            .andWhere('w.date >= :since', { since: twelveHoursAgo })
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
        const histories = await this.historyRepository.find({
            where: {
                id: In(ids),
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

        if (histories.length === 0) {
            return;
        }


        await Promise.all(
            histories.map(history => this.historyRepository.delete({ id: history.id }))
        );

        const workoutId = histories[0].workout.id;

        const historyRemaining = await this.historyRepository.exists({
            where: {
                workout: { id: workoutId }
            }
        });

        if (!historyRemaining) {
            return this.workoutService.delete(userId, workoutId);
        }
    }

    async graphs(userId: number, exerciseId: number) {
        return this.historyRepository
            .createQueryBuilder('h')
            .select([
                'TO_CHAR(w.date, \'MM-YYYY\') AS date',
                'cast(MAX(h.weight) as integer) AS weight'
            ])
            .leftJoin('h.exercise', 'e')
            .leftJoin('h.workout', 'w')
            .where('w.user.id = :userId', { userId })
            .andWhere('e.id = :exerciseId', { exerciseId })
            .groupBy('TO_CHAR(w.date, \'MM-YYYY\')')
            .orderBy('TO_CHAR(w.date, \'MM-YYYY\')', 'ASC')
            .getRawMany();
    }

    async countTotalWeight(userId: number, exerciseId: number) {
        const histories: History[] = await this.historyRepository.find({
            where: {
                exercise: {
                    id: exerciseId
                },
                workout: {
                    user: {
                        id: userId
                    }
                }
            }
        });

        return histories.reduce((acc, h) => acc + h.weight, 0);
    }

    async countMaxWeight(userId: number, exerciseId: number) {
        const history = await this.historyRepository.findOne({
            order: {
                weight: 'DESC'
            },
            where: {
                exercise: {
                    id: exerciseId
                },
                workout: {
                    user: {
                        id: userId
                    }
                }
            }
        });

        if (history?.weight) {
            return history.weight;
        }
        return 0;
    }

    async countTotalReps(userId: number, exerciseId: number) {
        const histories: History[] = await this.historyRepository.find({
            where: {
                exercise: {
                    id: exerciseId
                },
                workout: {
                    user: {
                        id: userId
                    }
                }
            }
        });

        return histories.reduce((acc, h) => acc + h.reps, 0);
    }
}
