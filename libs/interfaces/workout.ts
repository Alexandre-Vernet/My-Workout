import { User } from './user';
import { MuscleGroup } from './MuscleGroup';
import { History } from './history';

export class Workout {
    id?: number;
    user?: User;
    muscleGroup?: MuscleGroup;
    muscleGroups?: { muscleGroup: MuscleGroup, history: History[] }[];
    date: Date;
    history?: History[];
}
