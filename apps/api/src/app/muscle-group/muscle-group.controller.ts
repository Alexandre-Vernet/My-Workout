import { Controller, Get, Param } from '@nestjs/common';
import { MuscleGroupService } from './muscle-group.service';

@Controller('muscle-group')
export class MuscleGroupController {
  constructor(private readonly muscleGroupService: MuscleGroupService) {}

  @Get('users/:userId')
  findAll(@Param('userId') userId: number) {
    return this.muscleGroupService.findAllMuscleGroupByUserId(userId);
  }

    @Get('suggest-muscle-group/users/:userId')
    suggestMuscleGroup(@Param('userId') userId: number) {
        return this.muscleGroupService.suggestMuscleGroup(userId);
    }
}
