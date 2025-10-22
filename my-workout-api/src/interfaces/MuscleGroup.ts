export interface MuscleGroup {
    id: number;
    name?: string;
    exerciseCount?: number;
    isRecommended?: boolean;
    date?: Date;
    muscleGroupInfo?: MuscleGroupInfo;
}

interface MuscleGroupInfo {
    label: string;
    color: string;
}

type MuscleGroupKey =
    | 'pectoraux'
    | 'abdominaux'
    | 'course a pied'
    | 'triceps'
    | 'jambes'
    | 'epaules'
    | 'dos'
    | 'biceps';

export const muscleGroupMap: Record<MuscleGroupKey, MuscleGroupInfo> = {
    pectoraux: {
        label: 'Pecs',
        color: '#d50000'
    },
    triceps: {
        label: 'Triceps',
        color: '#f6bf26'
    },
    jambes: {
        label: 'Jambes',
        color: '#33b679'
    },
    epaules: {
        label: 'Épaules',
        color: '#039be5'
    },
    dos: {
        label: 'Dos',
        color: '#3f51b5'
    },
    biceps: {
        label: 'Biceps',
        color: '#8e24aa'
    },
    abdominaux: {
        label: 'Abdos',
        color: '#0b8043'
    },
    'course a pied': {
        label: 'Course',
        color: '#e67c73'
    },
};
