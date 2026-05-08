import { Muscle } from './Muscle';
import { ExerciseMuscle } from './ExerciseMuscle';

export interface Exercise {
    id?: number;
    name?: string;
    description?: string;
    smartWorkout?: boolean;
    muscles?: Muscle[];
    exerciseMuscles?: ExerciseMuscle[];
}
