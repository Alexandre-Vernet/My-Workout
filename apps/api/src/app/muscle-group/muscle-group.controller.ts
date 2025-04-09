import { Controller, Get } from '@nestjs/common';
import { MuscleGroupService } from './muscle-group.service';

@Controller('muscle-group')
export class MuscleGroupController {
  constructor(private readonly muscleGroupService: MuscleGroupService) {}

  @Get()
  findAll() {
    return this.muscleGroupService.findAll();
  }
}
