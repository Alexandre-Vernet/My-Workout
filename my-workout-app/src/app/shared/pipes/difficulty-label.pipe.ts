import { Pipe, PipeTransform } from '@angular/core';
import { DifficultyEnum, DifficultyLabels } from "../../../interfaces/DifficultyEnum";

@Pipe({
  name: 'difficultyLabel',
})
export class DifficultyLabelPipe implements PipeTransform {

  transform(difficulty: string | null | undefined) {
    if (!difficulty) {
        return '';
    }
    return DifficultyLabels[difficulty as DifficultyEnum] ?? difficulty;
  }
}
