import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HistoryEntity } from './history.entity';
import { In, Repository } from 'typeorm';
import { History } from '../interfaces/history';
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
            .orderBy('w.date', 'DESC')
            .addOrderBy('h.id', 'ASC')
            .getOne();
    }

    findTodayExercices(userId: number, muscleGroupId: number, exerciseId: number) {
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
            .andWhere('w.date <= :until', { until: new Date() })
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
        return this.historyRepository.query(`
                SELECT date, weight
                FROM (
                    SELECT DISTINCT ON (weight)
                    TO_CHAR(date, 'MM-YYYY') AS date, weight
                    FROM (
                    SELECT
                    MAX (h.weight) AS weight, MIN (w.date) AS date
                    FROM history h
                    JOIN workout w ON w.id = h.workout_id
                    JOIN exercises e ON e.id = h.exercise_id
                    WHERE w.user_id = $1
                    AND e.id = $2
                    GROUP BY TO_CHAR(w.date, 'MM-YYYY')
                    ) AS monthly_max
                    ORDER BY weight, date
                    ) AS distinct_weights
                ORDER BY TO_DATE(date, 'MM-YYYY') ASC;`,
            [userId, exerciseId]);
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
