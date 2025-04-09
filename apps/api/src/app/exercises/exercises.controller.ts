import { Controller, Get, Query } from '@nestjs/common';
import { ExercisesService } from './exercises.service';

@Controller('exercises')
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  @Get()
  findOne(@Query('muscleGroup') muscleGroup: number) {
    return this.exercisesService.findExercisesByMuscleGroupId(muscleGroup);
  }
}
