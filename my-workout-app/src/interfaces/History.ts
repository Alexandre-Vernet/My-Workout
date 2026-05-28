import { Exercise } from './Exercise';
import { User } from './User';
import { Workout } from './Workout';

export interface History {
    id?: number;
    workout?: Workout;
    user?: User;
    exercise?: Exercise;
    weight?: number;
    reps?: number;
    unilateral?: boolean;
    duration?: number;
    restTime?: string;
}
