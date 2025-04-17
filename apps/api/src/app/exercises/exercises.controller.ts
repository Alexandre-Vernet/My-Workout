import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ExercisesService } from './exercises.service';

@Controller('exercises')
export class ExercisesController {
    constructor(private readonly exercisesService: ExercisesService) {
    }

    @Post()
    @HttpCode(200)
    findOne(@Body() { muscleGroupId, userId }: { muscleGroupId: number, userId: number }) {
        return this.exercisesService.findExercisesByMuscleGroupIdAndUserId(userId, muscleGroupId);
    }
}
