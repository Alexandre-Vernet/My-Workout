import { User } from './User';
import { MuscleGroup } from './MuscleGroup';
import { History } from './History';
import { Gym } from './gym';

export interface Workout {
    id?: number;
    user?: User;
    muscleGroup?: MuscleGroup;
    date: Date;
    histories?: History[];
    gym?: Gym;
}
