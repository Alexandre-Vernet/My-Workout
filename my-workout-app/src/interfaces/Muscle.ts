import { MuscleGroup } from './MuscleGroup';
import { MuscleDropdown } from "./MuscleDropdown";

export interface Muscle {
    id: number;
    name?: string;
    muscleGroup?: MuscleGroup;
    musclesDropdown: MuscleDropdown[];
}
