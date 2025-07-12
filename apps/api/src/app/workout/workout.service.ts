import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WorkoutEntity } from './workout.entity';
import { Between, Repository } from 'typeorm';
import { muscleGroupMap } from '../../../../../libs/interfaces/MuscleGroup';
import { Workout } from '../../../../../libs/interfaces/workout';
import { removeAccents } from '../../../../app/src/app/utils/remove-accents';
import { GroupedHistory } from '../../../../../libs/interfaces/history';

@Injectable()
export class WorkoutService {

    constructor(
        @InjectRepository(WorkoutEntity)
        private readonly workoutRepository: Repository<WorkoutEntity>
    ) {
    }

    async create(workout: Workout) {
        if (workout.muscleGroup.id !== 8) {
            // Do not create a workout if it already exists for the same user and muscle group on the same day
            // Except cardio workout because it can be done multiple times a day with different exercises (e.g. running, cycling)
            const existingWorkout = await this.checkDuplicateWorkout(workout.user.id, workout.muscleGroup.id);
            if (existingWorkout) {
                return existingWorkout;
            }
        }

        return this.workoutRepository.save(workout);
    }

    async find(userId: number) {
        const workoutEntity = await this.workoutRepository.find({
            where: { user: { id: userId } },
            relations: {
                muscleGroup: true,
                history: { exercise: true }
            }
        });

        const result: Workout[] = [];

        for (const workout of workoutEntity) {
            const workoutDate = new Date(workout.date);
            workoutDate.setHours(0, 0, 0, 0);

            let dayEntry = result.find(entry =>
                new Date(entry.date).getTime() === workoutDate.getTime()
            );

            if (!dayEntry) {
                dayEntry = {
                    date: workoutDate,
                    muscleGroups: []
                };
                result.push(dayEntry);
            }

            let groupEntry = dayEntry.muscleGroups.find(g =>
                g.muscleGroup.id === workout.muscleGroup.id
            );

            if (!groupEntry) {
                groupEntry = {
                    muscleGroup: workout.muscleGroup,
                    history: []
                };
                dayEntry.muscleGroups.push(groupEntry);
            }

            for (const history of workout.history) {
                const { id, reps, weight, exercise } = history;

                let exerciseEntry = groupEntry.history.find(e =>
                    e.exercise.id === exercise.id
                );

                if (!exerciseEntry) {
                    exerciseEntry = {
                        exercise,
                        groupedHistory: []
                    };
                    groupEntry.history.push(exerciseEntry);
                }

                exerciseEntry.groupedHistory.push({ id, reps, weight });
            }
        }

        result.sort((a, b) => b.date.getTime() - a.date.getTime());

        return result;
    }


    async findById(id: number) {
        const workout: Workout = await this.workoutRepository.findOne({
            where: { id },
            relations: {
                history: {
                    exercise: true
                },
                muscleGroup: true
            }
        });

        const historyGroupedByExercise = new Map<number, GroupedHistory[]>();

        workout.history.forEach(h => {
            const exerciseId = h.exercise.id;
            if (!historyGroupedByExercise.has(exerciseId)) {
                historyGroupedByExercise.set(exerciseId, []);
            }
            historyGroupedByExercise.get(exerciseId)!.push({
                id: h.id,
                weight: h.weight,
                reps: h.reps ?? null
            });

            delete h.id;
            delete h.weight;
            delete h.reps;
        });

        const seen = new Set<number>();
        const uniqueHistory = workout.history.filter(item => {
            if (seen.has(item.exercise.id)) return false;
            seen.add(item.exercise.id);
            return true;
        });

        uniqueHistory.forEach(h => {
            h.groupedHistory = historyGroupedByExercise.get(h.exercise.id);
        });


        workout.history = uniqueHistory;

        return workout;

    }


    async findByDate(userId: number, start: Date, end: Date) {
        const workout = await this.workoutRepository.find({
            where: {
                user: {
                    id: userId
                },
                date: Between(start, end)
            },
            relations: {
                muscleGroup: true,
                history: {
                    exercise: true
                }
            }
        });

        workout.forEach(w => {
            // Display exercise name for cardio instead "CARDIO" in calendar
            if (w.muscleGroup.id === 8) {
                w.muscleGroup.name = muscleGroupMap[removeAccents(w.history[0].exercise.name)]?.label ?? w.history[0].exercise.name;
            }
        });

        return workout;
    }

    checkDuplicateWorkout(userId: number, muscleGroupId: number) {
        return this.workoutRepository
            .createQueryBuilder('w')
            .where('w.user.id = :userId', { userId })
            .andWhere('w.muscleGroup.id = :muscleGroupId', { muscleGroupId })
            .andWhere('DATE(w.date) = DATE(:date)', { date: new Date() })
            .getOne();
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

        if (historyToDelete) {
            return this.workoutRepository.delete({ id: historyToDelete.id });
        }
    }

    async deleteWorkoutIfNoHistory(workoutId: number) {
        const workout = await this.workoutRepository.findOne({
            where: {
                id: workoutId
            },
            relations: {
                history: true
            }
        });

        if (workout?.history.length === 0) {
            return this.workoutRepository.delete({ id: workout.id });
        }
    }
}
