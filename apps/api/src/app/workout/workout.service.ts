import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WorkoutEntity } from './workout.entity';
import { Repository } from 'typeorm';
import { renameMuscleGroupMap } from '../../../../../libs/interfaces/MuscleGroup';
import { Workout } from '../../../../../libs/interfaces/workout';

@Injectable()
export class WorkoutService {


    constructor(
        @InjectRepository(WorkoutEntity)
        private readonly workoutRepository: Repository<WorkoutEntity>
    ) {
    }

    async create(workout: Workout) {
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
            w.muscleGroup.name = renameMuscleGroupMap[w.muscleGroup.name] ?? w.muscleGroup.name;

            // Display exercise name for cardio instead "CARDIO" in calendar
            if (w.muscleGroup.id === 8) {
                w.muscleGroup.name = renameMuscleGroupMap[w.history[0].exercise.name] ?? w.history[0].exercise.name;
            }
        });

        return workout;
    }

    checkDuplicateWorkout(userId: number, muscleGroupId: number) {
        return this.workoutRepository
            .createQueryBuilder('w')
            .where('w.user.id = :userId', { userId })
            .where('w.muscleGroup.id = :muscleGroupId', { muscleGroupId })
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
