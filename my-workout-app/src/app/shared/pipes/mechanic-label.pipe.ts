import { Pipe, PipeTransform } from '@angular/core';
import { MechanicLabels } from "../../../interfaces/MechanicEnum";

@Pipe({
  name: 'mechanicLabel',
})
export class MechanicLabelPipe implements PipeTransform {

  transform(mechanic: string) {
    return MechanicLabels[mechanic] ?? mechanic;
  }
}
