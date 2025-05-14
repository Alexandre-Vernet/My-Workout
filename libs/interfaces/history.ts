import { Exercise } from './exercise';
import { User } from './user';
import { Workout } from './workout';

export interface History {
    id?: number;
    workout: Workout;
    user?: User;
    exercise: Exercise;
    weight: number;
    createdAt: Date;
}
