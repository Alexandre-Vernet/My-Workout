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
            const { workout, exercise, weight } = h;
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

            // Find if exercise with same id and weight already exists in this group
            let existingExercise = groupEntry.exercises.find(e => e.id === exercise.id && e.weight === weight);

            if (existingExercise) {
                // Increase the count
                if (existingExercise.count) {
                    existingExercise.count++;
                }
            } else {
                // Add new exercise with count = 1
                groupEntry.exercises.push({
                    ...exercise,
                    weight,
                    count: 1
                });
            }
        }


        // Order by workout date
        history.sort((a, b) => b.workout.date.getTime() - a.workout.date.getTime());

        return history;
    }

    findLastHistoryWeightByExerciseId(userId: number, exerciseId: number) {
        return this.historyRepository.findOne({
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
            .getMany();
    }
}
