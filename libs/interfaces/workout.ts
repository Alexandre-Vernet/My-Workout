import { User } from './user';
import { Exercise } from './exercise';

export class Workout {
    id?: number;
    user: User;
    exercise: Exercise;
}
