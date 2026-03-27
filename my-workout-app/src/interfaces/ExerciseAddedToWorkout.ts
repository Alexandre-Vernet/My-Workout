import { Exercise } from './Exercise';
import { Muscle } from './Muscle';

export class ExerciseAddedToWorkout {
    exercise: Exercise;
    muscles: Muscle[];
    addedToWorkout: boolean;
    order: number;
}
