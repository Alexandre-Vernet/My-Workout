import { Controller, Get, Param } from '@nestjs/common';
import { MuscleGroupService } from './muscle-group.service';

@Controller('muscle-group')
export class MuscleGroupController {
  constructor(private readonly muscleGroupService: MuscleGroupService) {}

  @Get()
  findAll() {
    return this.muscleGroupService.findAllMuscleGroupByUserId();
  }

  @Get('users/:userId')
  findAllMuscleGroupAndCountExercisesByUserId(@Param('userId') userId: number) {
    return this.muscleGroupService.findAllMuscleGroupAndCountExercisesByUserId(userId);
  }

    @Get('suggest-muscle-group/users/:userId')
    suggestMuscleGroup(@Param('userId') userId: number) {
        return this.muscleGroupService.suggestMuscleGroup(userId);
    }
}
