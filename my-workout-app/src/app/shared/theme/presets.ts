import { createPreset } from './preset-factory';

export const presets = {
    emerald: {
        preset: createPreset('emerald'),
        color: '#10B981'
    },
    green: {
        preset: createPreset('green'),
        color: '#34D399'
    },
    lime: {
        preset: createPreset('lime'),
        color: '#A3E635'
    },
    red: {
        preset: createPreset('red'),
        color: '#F87171'
    },
    orange: {
        preset: createPreset('orange'),
        color: '#FB923C'
    },
    amber: {
        preset: createPreset('amber'),
        color: '#FBBF24'
    },
    yellow: {
        preset: createPreset('yellow'),
        color: '#FCD34D'
    },
    teal: {
        preset: createPreset('teal'),
        color: '#14B8A6'
    },
    cyan: {
        preset: createPreset('cyan'),
        color: '#22D3EE'
    },
    sky: {
        preset: createPreset('sky'),
        color: '#38BDF8'
    },
    blue: {
        preset: createPreset('blue'),
        color: '#3B82F6'
    },
    indigo: {
        preset: createPreset('indigo'),
        color: '#6366F1'
    },
    violet: {
        preset: createPreset('violet'),
        color: '#8B5CF6'
    },
    purple: {
        preset: createPreset('purple'),
        color: '#A855F7'
    },
    fuchsia: {
        preset: createPreset('fuchsia'),
        color: '#D946EF'
    },
    pink: {
        preset: createPreset('pink'),
        color: '#EC4899'
    },
    rose: {
        preset: createPreset('rose'),
        color: '#F43F5E'
    }
};

export type PresetName = keyof typeof presets;
