import { Muscle } from './muscle';
import { ExerciseMuscle } from './exercise-muscle';

export interface Exercise {
    id?: number;
    name?: string;
    description?: string;
    smartWorkout?: boolean;
    addedToWorkout?: boolean;
    muscles?: Muscle[];
    exerciseMuscles?: ExerciseMuscle[];
}
