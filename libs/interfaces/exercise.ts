import { Muscle } from './muscle';

export interface Exercise {
    id: number;
    name?: string;
    description?: string;
    userExerciseId?: number;
    isSmartWorkout?: boolean;
    order?:number;
    addedToWorkout?: boolean;
    muscles?: Muscle[];
    weight?: number;
    restTime?: string;
    count?: number;
}
