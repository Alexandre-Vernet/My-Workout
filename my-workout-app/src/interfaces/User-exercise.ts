import { User } from './User';
import { Exercise } from './Exercise';

export interface UserExercise {
    id?: number;
    user?: User;
    exercise: Exercise;
    order?: number;
}
