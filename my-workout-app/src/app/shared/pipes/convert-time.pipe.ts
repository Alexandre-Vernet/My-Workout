import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'convertTime',
})
export class ConvertTimePipe implements PipeTransform {

    transform(duration: number) {
        if (duration < 60) {
            return `${ duration } mn`;
        } else {
            const hours = Math.floor(duration / 60);
            const remainingMinutes = duration % 60;

            if (remainingMinutes === 0) {
                return `${ hours } h`;
            } else {
                return `${ hours }h${ remainingMinutes }`;
            }
        }
    }

}
