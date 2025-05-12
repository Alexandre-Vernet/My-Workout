import { User } from './user';
import { MuscleGroup } from './MuscleGroup';

export class Workout {
    id?: number;
    user?: User;
    muscleGroup: MuscleGroup;
    date: Date;
}
