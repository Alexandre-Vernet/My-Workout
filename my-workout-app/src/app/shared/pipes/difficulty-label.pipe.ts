import { Pipe, PipeTransform } from '@angular/core';
import { DifficultyEnum } from "../../../interfaces/DifficultyEnum";

@Pipe({
  name: 'difficultyLabel',
})
export class DifficultyLabelPipe implements PipeTransform {

  transform(difficulty: string) {
    return DifficultyEnum[difficulty] ?? difficulty;
  }
}
