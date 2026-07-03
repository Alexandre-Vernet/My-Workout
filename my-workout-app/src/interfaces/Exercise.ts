import { Muscle } from './Muscle';
import { ExerciseMuscle } from './ExerciseMuscle';

export interface Exercise {
    id?: number;
    name?: string;
    description?: string;
    muscles?: Muscle[];
    exerciseMuscles?: ExerciseMuscle[];
}
