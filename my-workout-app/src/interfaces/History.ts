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
    restTime?: string;
    date?: Date | string;
    groupedHistory?: GroupedHistory[];
}


export interface GroupedHistory {
    id: number;
    weight: number;
    reps: number;
    duration: number | string;
}
