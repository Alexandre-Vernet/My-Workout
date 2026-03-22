import { Muscle } from './muscle';
import { ExerciseMuscle } from './exercise-muscle';

export interface Exercise {
    id?: number;
    name?: string;
    description?: string;
    userExerciseId?: number;
    smartWorkout?: boolean;
    addedToWorkout?: boolean;
    muscles?: Muscle[];
    muscleGroup?: string;
    exerciseMuscles?: ExerciseMuscle[];
}
