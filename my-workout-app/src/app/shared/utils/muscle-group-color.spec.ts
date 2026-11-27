import { getContrastingTextColor, getMuscleGroupColor, getMuscleGroupLabel } from './muscle-group-color';

describe('getMuscleGroupColor', () => {
    it('returns the mapped color for a known muscle group', () => {
        expect(getMuscleGroupColor('Pectoraux')).toBe('#d50000');
    });

    it('is accent and case insensitive', () => {
        expect(getMuscleGroupColor('ÉPAULES')).toBe('#039be5');
    });

    it('falls back to the default color for an unknown muscle group', () => {
        expect(getMuscleGroupColor('Mollets')).toBe('#d77c05');
    });

    it('falls back to the default color when the name is missing', () => {
        expect(getMuscleGroupColor(undefined)).toBe('#d77c05');
        expect(getMuscleGroupColor(null)).toBe('#d77c05');
    });
});

describe('getMuscleGroupLabel', () => {
    it('returns the mapped label for a known muscle group', () => {
        expect(getMuscleGroupLabel('pectoraux')).toBe('Pecs');
    });

    it('falls back to the raw name for an unknown muscle group', () => {
        expect(getMuscleGroupLabel('Mollets')).toBe('Mollets');
    });

    it('falls back to an empty string when the name is missing', () => {
        expect(getMuscleGroupLabel(undefined)).toBe('');
    });
});

describe('getContrastingTextColor', () => {
    it('returns white text for a dark background color', () => {
        expect(getContrastingTextColor('#d50000')).toBe('#ffffff');
    });

    it('returns dark text for a light/bright background color', () => {
        expect(getContrastingTextColor('#f6bf26')).toBe('#1a1a1a');
    });
});
