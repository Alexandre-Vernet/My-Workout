export class DateUtils {
    // Built from LOCAL date components (not toISOString(), which converts to UTC and can
    // shift the day by one depending on the user's time zone/time of day).
    static toLocalDate(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${ year }-${ month }-${ day }`;
    }
}
