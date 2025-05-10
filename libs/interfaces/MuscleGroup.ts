export interface MuscleGroup {
    id: number;
    ids: number[];
    name: string;
    exerciseCount?: number;
    isRecommended?: boolean;
    date: Date;
    muscleGroups?: string[];
}

export const renameMuscleGroupMap: Record<string, string> = {
    'Pectoraux': 'Pecs',
    'Abdominaux': 'Abdos'
};
