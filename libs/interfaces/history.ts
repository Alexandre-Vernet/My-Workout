import { Exercise } from './exercise';
import { User } from './user';
import { Workout } from './workout';
import { MuscleGroup } from './MuscleGroup';

export interface History {
    id?: number;
    workout?: Workout;
    user?: User;
    exercise?: Exercise;
    weight?: number;
    reps?: number;
    date?: Date,
    groups?: {
        workoutId: number;
        muscleGroup: MuscleGroup,
        exercises: Exercise[]
    }[]
}
