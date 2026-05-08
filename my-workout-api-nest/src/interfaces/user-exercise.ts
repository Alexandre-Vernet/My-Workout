import { User } from './user';
import { Exercise } from './exercise';

export interface UserExercise {
    id?: number;
    user?: User;
    exercise: Exercise;
    order?: number;
}
