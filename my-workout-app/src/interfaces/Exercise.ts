import { Muscle } from './Muscle';
import { ExerciseMuscle } from './ExerciseMuscle';

export interface Exercise {
    id?: number;
    name?: string;
    description?: string;
    smartWorkout?: boolean;
    addedToWorkout?: boolean;
    muscles?: Muscle[];
    exerciseMuscles?: ExerciseMuscle[];
}
