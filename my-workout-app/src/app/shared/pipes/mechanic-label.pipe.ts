import { Pipe, PipeTransform } from '@angular/core';
import { MechanicEnum, MechanicLabels } from "../../../interfaces/MechanicEnum";

@Pipe({
  name: 'mechanicLabel',
})
export class MechanicLabelPipe implements PipeTransform {

  transform(mechanic: string | null | undefined) {
    if (!mechanic) {
        return '';
    }
    return MechanicLabels[mechanic as MechanicEnum] ?? mechanic;
  }
}
