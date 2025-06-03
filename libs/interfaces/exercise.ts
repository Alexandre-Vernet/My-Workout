export interface Exercise {
    id: number;
    name?: string;
    description?: string;
    userExerciseId?: number;
    isSmartWorkout?: boolean;
    order?:number;
    addedToWorkout?: boolean;
    muscles?: string[];
    weight?: number;
    restTime?: string;
    count?: number;
}
