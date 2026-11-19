import { PluralPipe } from './plural.pipe';

describe('PluralPipe', () => {
    const pipe = new PluralPipe();

    it('returns "s" when the array has more than one element', () => {
        expect(pipe.transform([1, 2])).toBe('s');
    });

    it('returns null for a single-element array', () => {
        expect(pipe.transform([1])).toBeNull();
    });

    it('returns null for an empty, null or undefined array', () => {
        expect(pipe.transform([])).toBeNull();
        expect(pipe.transform(null)).toBeNull();
        expect(pipe.transform(undefined)).toBeNull();
    });
});
