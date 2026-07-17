import { Pipe, PipeTransform } from '@angular/core';
import { MechanicEnum } from "../../../interfaces/MechanicEnum";

@Pipe({
  name: 'mechanicLabel',
})
export class MechanicLabelPipe implements PipeTransform {

  transform(mechanic: string) {
    return MechanicEnum[mechanic] ?? mechanic;
  }
}
