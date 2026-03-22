import { Exercise } from './exercise';
import { Muscle } from './muscle';

export class ExerciseAddedToWorkout {
    exercise: Exercise;
    muscles: Muscle[];
    addedToWorkout: boolean;
    order: number;
}
