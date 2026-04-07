import { User } from './User';
import { MuscleGroup } from './MuscleGroup';
import { History } from './History';

export class Workout {
    id?: number;
    user?: User;
    muscleGroup?: MuscleGroup;
    date: Date;
    histories?: History[];
    duration?: number;
}
