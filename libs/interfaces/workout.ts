import { User } from './user';
import { Exercise } from './exercise';

export interface Workout {
    id?: number;
    user: User;
    exercise: Exercise;
}
