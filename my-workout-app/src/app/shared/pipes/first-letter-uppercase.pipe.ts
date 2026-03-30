import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'firstLetterUppercase',
})
export class FirstLetterUppercasePipe implements PipeTransform {

  transform(value: string) {
      if (!value) {
          return '';
      }
      const firstLetter = value.at(0).toUpperCase();
    return firstLetter + value.slice(1).toLowerCase();
  }

}
