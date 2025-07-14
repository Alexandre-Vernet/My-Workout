import { Exercise } from './exercise';
import { User } from './user';
import { Workout } from './workout';

export interface History {
    id?: number;
    workout?: Workout;
    user?: User;
    exercise?: Exercise;
    weight?: number;
    reps?: number;
    restTime?: string;
    date?: Date | string,
    groupedHistory?: GroupedHistory[]
}


export interface GroupedHistory {
    id: number;
    weight: number;
    reps: number;
}
