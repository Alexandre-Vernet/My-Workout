import { muscleGroupMap, MuscleGroupKey } from '../../../interfaces/MuscleGroup';
import { removeAccents } from './remove-accents';

const FALLBACK_COLOR = '#d77c05';

function lookup(muscleGroupName: string | null | undefined) {
    const key = removeAccents(muscleGroupName ?? '') as MuscleGroupKey | null;
    return key ? muscleGroupMap[key] : undefined;
}

export function getMuscleGroupColor(muscleGroupName: string | null | undefined): string {
    return lookup(muscleGroupName)?.color ?? FALLBACK_COLOR;
}

export function getMuscleGroupLabel(muscleGroupName: string | null | undefined): string {
    return lookup(muscleGroupName)?.label ?? muscleGroupName ?? '';
}
