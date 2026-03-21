import { Muscle } from './muscle';
import { ExerciseMuscle } from './exercise-muscle';

export interface Exercise {
    id?: number;
    name?: string;
    description?: string;
    userExerciseId?: number;
    isSmartWorkout?: boolean;
    addedToWorkout?: boolean;
    muscleList?: Muscle[];
    muscleGroup?: string;
    exerciseMuscleList?: ExerciseMuscle[];
}
