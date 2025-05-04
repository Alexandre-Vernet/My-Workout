import { Exercise } from './exercise';
import { User } from './user';

export interface History {
    id?: number;
    user?: User;
    exercise: Exercise;
    weight: number;
    createdAt: Date;
}
