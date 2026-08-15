export enum DifficultyEnum {
    BEGINNER = 'BEGINNER',
    INTERMEDIATE = 'INTERMEDIATE',
    ADVANCED = 'ADVANCED'
}

export const DifficultyLabels: Record<DifficultyEnum, string> = {
    [DifficultyEnum.BEGINNER]: 'Débutant',
    [DifficultyEnum.INTERMEDIATE]: 'Intermédiaire',
    [DifficultyEnum.ADVANCED]: 'Avancé'
};
