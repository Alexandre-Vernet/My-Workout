export interface MuscleGroup {
    id: number;
    name?: string;
    exerciseCount?: number;
    isRecommended?: boolean;
    date?: Date;
}

export const renameMuscleGroupMap: Record<string, string> = {
    'Pectoraux': 'Pecs',
    'Abdominaux': 'Abdos',
    'Course à pied': 'Running',
};
