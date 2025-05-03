export class MuscleGroup {
    id: number;
    name: string;
    exerciseCount?: number;
    isRecommended?: boolean;
    createdAt: Date;
}

export const renameMuscleGroupMap: Record<string, string> = {
    'Pectoraux': 'Pec',
    'Abdominaux': 'Abdos'
};
