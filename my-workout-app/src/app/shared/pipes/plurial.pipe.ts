import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'plurial',
})
export class PlurialPipe implements PipeTransform {

    transform(arr: any[]) {
        if (arr?.length > 1) {
            return 's';
        } else {
            return null;
        }
    }

}
