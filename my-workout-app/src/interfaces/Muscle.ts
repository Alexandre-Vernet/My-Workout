import { MuscleGroup } from './MuscleGroup';

export interface Muscle {
    id: number;
    name?: string;
    muscleGroup?: MuscleGroup;
}
