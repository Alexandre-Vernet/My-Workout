import { Pipe, PipeTransform } from '@angular/core';
import { DifficultyLabels } from "../../../interfaces/DifficultyEnum";

@Pipe({
  name: 'difficultyLabel',
})
export class DifficultyLabelPipe implements PipeTransform {

  transform(difficulty: string) {
    return DifficultyLabels[difficulty] ?? difficulty;
  }
}
