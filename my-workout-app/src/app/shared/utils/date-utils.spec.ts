import { DateUtils } from './date-utils';

describe('DateUtils.toLocalDate', () => {
    it('formats a date using its local year, month and day (not UTC)', () => {
        const date = new Date(2026, 0, 5); // January 5, 2026, local time
        expect(DateUtils.toLocalDate(date)).toBe('2026-01-05');
    });

    it('pads single-digit months and days with a leading zero', () => {
        const date = new Date(2026, 8, 1); // September 1, 2026
        expect(DateUtils.toLocalDate(date)).toBe('2026-09-01');
    });

    it('does not shift the day across a UTC boundary close to midnight local time', () => {
        // Midnight on the 1st of the month, local time: a toISOString()-based (UTC)
        // implementation would roll this back to the previous month in UTC+1/+2.
        const date = new Date(2026, 5, 1, 0, 0, 0);
        expect(DateUtils.toLocalDate(date)).toBe('2026-06-01');
    });
});
