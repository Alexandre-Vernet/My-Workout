import { MuscleGroup } from './MuscleGroup';
import { ExerciseAddedToWorkout } from './ExerciseAddedToWorkout';
import { Muscle } from './muscle';

export class MuscleGroupExercises {
    muscleGroup: MuscleGroup;
    exerciseAddedToWorkouts: ExerciseAddedToWorkout[];
    muscles: Muscle[];
}
