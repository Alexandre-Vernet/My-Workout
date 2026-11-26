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

// Picks the more readable of black/white text for a solid-colored badge, based on
// perceived brightness (YIQ) — independent of light/dark theme, since the badge
// background is the muscle group's own color rather than a theme surface.
export function getContrastingTextColor(hexColor: string): string {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    return brightness >= 150 ? '#1a1a1a' : '#ffffff';
}
