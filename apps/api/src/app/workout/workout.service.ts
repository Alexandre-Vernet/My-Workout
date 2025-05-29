import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WorkoutEntity } from './workout.entity';
import { Repository } from 'typeorm';
import { muscleGroupMap } from '../../../../../libs/interfaces/MuscleGroup';
import { Workout } from '../../../../../libs/interfaces/workout';
import { removeAccents } from '../../../../app/src/app/utils/remove-accents';

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


    async findById(id: number) {
        const workout = await this.workoutRepository.findOne({
            where: { id },
            relations: {
                history: {
                    exercise: true
                },
                muscleGroup: true
            }
        });

        if (!workout) {
            return null;
        }

        // 1. Count the number of occurrences for each unique combination of exercise ID and weight
        const counts: Record<string, number> = {};
        workout.history.forEach(h => {
            const key = `${ h.exercise.id }-${ h.weight }`;
            counts[key] = (counts[key] || 0) + 1;
        });

        // 2. Remove duplicates by keeping only the first occurrence of each unique key
        const seen = new Set<string>();
        const uniqueHistory = workout.history.filter(h => {
            const key = `${ h.exercise.id }-${ h.weight }`;
            if (seen.has(key)) {
                return false; // duplicate => skip
            }
            seen.add(key);
            return true; // first occurrence => keep
        });

        // 3. Add the count to each exercise in the deduplicated list
        workout.history = uniqueHistory.map(h => {
            const key = `${ h.exercise.id }-${ h.weight }`;
            return {
                ...h,
                exercise: {
                    ...h.exercise,
                    count: counts[key]
                }
            };
        });

        // 4. Sort by exercise ID first, then by weight if IDs match
        workout.history.sort((a, b) => {
            if (a.exercise.id === b.exercise.id) {
                return Number(a.weight) - Number(b.weight);
            }
            return a.exercise.id - b.exercise.id;
        });

        return workout;
    }


    async find(userId: number) {
        const workout = await this.workoutRepository.find({
            where: {
                user: {
                    id: userId
                }
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
}
