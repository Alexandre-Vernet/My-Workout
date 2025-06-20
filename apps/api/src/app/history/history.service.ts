import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HistoryEntity } from './history.entity';
import { Repository } from 'typeorm';
import { History } from '../../../../../libs/interfaces/history';

@Injectable()
export class HistoryService {

    constructor(
        @InjectRepository(HistoryEntity)
        private readonly historyRepository: Repository<HistoryEntity>
    ) {
    }

    create(history: History) {
        return this.historyRepository.save(history);
    }

    async find(userId: number) {
        const historyEntity = await this.historyRepository.find({
            where: {
                workout: {
                    user: {
                        id: userId
                    }
                }
            },
            relations: {
                workout: {
                    muscleGroup: true
                },
                exercise: true
            }
        });

        const history: History[] = [];

        for (const h of historyEntity) {
            const { workout, exercise, weight, reps } = h;
            const { muscleGroup, date } = workout;


            // Find the entry for the current date (without time)
            let dataEntry = history.find(h => {
                const resultDateWithoutTime = new Date(h.workout.date);
                resultDateWithoutTime.setHours(0, 0, 0, 0);
                const dateWithoutTime = new Date(date);
                dateWithoutTime.setHours(0, 0, 0, 0);

                return resultDateWithoutTime.getTime() === dateWithoutTime.getTime();
            });
            if (!dataEntry) {
                dataEntry = {
                    workout: {
                        date
                    },
                    groups: []
                };
                history.push(dataEntry);
            }

            // Find the muscle group within the date
            let groupEntry: any = dataEntry.groups.find(g => g.muscleGroup.id === muscleGroup.id);
            if (!groupEntry) {
                groupEntry = {
                    muscleGroup,
                    exercises: [],
                    workoutId: workout.id
                };
                dataEntry.groups.push(groupEntry);
            }

            groupEntry.exercises.push({
                ...exercise,
                weight,
                reps
            });
        }


        // Order by workout date
        history.sort((a, b) => b.workout.date.getTime() - a.workout.date.getTime());

        return history;
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
}
