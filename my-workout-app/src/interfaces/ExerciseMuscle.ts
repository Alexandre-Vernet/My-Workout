import { Exercise } from './Exercise';
import { Muscle } from './Muscle';

export interface ExerciseMuscle {
    exercise?: Exercise;
    muscles?: Muscle[];
    addedToWorkout?: boolean;
}
