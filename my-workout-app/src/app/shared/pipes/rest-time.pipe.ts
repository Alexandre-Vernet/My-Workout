import { Pipe, PipeTransform } from '@angular/core';
import { RestTimeValue } from '../../../interfaces/RestTimeValue';

@Pipe({
    name: 'restTime',
})
export class RestTimePipe implements PipeTransform {

    // Format: MM:SS:CS (e.g. 02:05:72)
    transform({ minutes, seconds, centiseconds }: RestTimeValue): string {
        return `${ minutes.toString().padStart(2, '0') }:${ seconds.toString().padStart(2, '0') }:${ centiseconds.toString().padStart(2, '0') }`;
    }

}
