import { User } from './user';
import { MuscleGroup } from './MuscleGroup';
import { History } from './history';

export class Workout {
    id?: number;
    user?: User;
    muscleGroup?: MuscleGroup;
    date: Date;
    history?: History[];
}
