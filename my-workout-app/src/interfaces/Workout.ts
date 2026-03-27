import { User } from './User';
import { MuscleGroup } from './MuscleGroup';
import { History } from './History';

export class Workout {
    id?: number;
    user?: User;
    muscleGroup?: MuscleGroup;
    muscleGroups?: { muscleGroup: MuscleGroup, history: History[] }[];
    date: Date;
    histories?: History[];
    duration?: number;
}
