export interface Exercise {
    id: number;
    name?: string;
    description?: string;
    userExerciseId?: number;
    isSmartWorkout?: boolean;
    order?:number;
    addedToWorkout?: boolean;
    muscleGroup?: boolean;
    weight?: number;
    restTime?: string;
    count?: number;
}
