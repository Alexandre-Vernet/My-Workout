export class DateUtils {
    static toLocalDate(date: Date): string {
        return date.toISOString().slice(0, 10);
    }
}
