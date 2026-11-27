import { FirstLetterUppercasePipe } from './first-letter-uppercase.pipe';

describe('FirstLetterUppercasePipe', () => {
    const pipe = new FirstLetterUppercasePipe();

    it('capitalizes the first letter and lowercases the rest', () => {
        expect(pipe.transform('pectoraux')).toBe('Pectoraux');
        expect(pipe.transform('ABDOMINAUX')).toBe('Abdominaux');
    });

    it('returns an empty string for empty or falsy input', () => {
        expect(pipe.transform('')).toBe('');
        expect(pipe.transform(null)).toBe('');
        expect(pipe.transform(undefined)).toBe('');
    });
});
