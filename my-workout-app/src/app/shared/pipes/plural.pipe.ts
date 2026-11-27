import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'plural',
})
export class PluralPipe implements PipeTransform {

    transform(arr: unknown[] | null | undefined) {
        if (arr && arr.length > 1) {
            return 's';
        } else {
            return null;
        }
    }

}
