import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

export function createPreset(colorName: string) {
    return definePreset(Aura, {
        semantic: {
            primary: {
                50: `{${ colorName }.50}`,
                100: `{${ colorName }.100}`,
                200: `{${ colorName }.200}`,
                300: `{${ colorName }.300}`,
                400: `{${ colorName }.400}`,
                500: `{${ colorName }.500}`,
                600: `{${ colorName }.600}`,
                700: `{${ colorName }.700}`,
                800: `{${ colorName }.800}`,
                900: `{${ colorName }.900}`,
                950: `{${ colorName }.950}`
            }
        }
    });
}
