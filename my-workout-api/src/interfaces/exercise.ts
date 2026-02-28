import { Muscle } from './muscle';
import { ExerciseMuscle } from './exercise-muscle';

export interface Exercise {
    id: number;
    name?: string;
    description?: string;
    userExerciseId?: number;
    isSmartWorkout?: boolean;
    order?:number;
    addedToWorkout?: boolean;
    muscles?: Muscle[];
    weight?: number;
    reps?: number;
    muscleGroup?: string;
    exerciseMuscle?: ExerciseMuscle[];
}
