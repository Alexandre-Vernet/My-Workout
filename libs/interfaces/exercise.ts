export interface Exercise {
    id: number;
    name?: string;
    description?: string;
    userExerciseId?: number;
    isSmartWorkout?: boolean;
    order?:number;
    addedToWorkout?: boolean;
    muscleGroups?: string[];
    weight?: number;
    restTime?: string;
    count?: number;
}
