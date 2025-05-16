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
    date?: Date,
    groups?: {
        muscleGroup: MuscleGroup,
        exercises: Exercise[]
    }[]
}
