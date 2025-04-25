import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ExercisesService } from './exercises.service';

@Controller('exercises')
export class ExercisesController {
    constructor(private readonly exercisesService: ExercisesService) {
    }

    @Post('find-all-exercises-by-muscle-group-id-and-user-id')
    @HttpCode(200)
    findAllExercisesByMuscleGroupIdAndUserId(@Body() { muscleGroupId, userId }: { muscleGroupId: number, userId: number }) {
        return this.exercisesService.findAllExercisesByMuscleGroupIdAndUserId(userId, muscleGroupId);
    }

    @Post('find-exercises-by-muscle-group-id-and-user-id')
    @HttpCode(200)
    findExercisesByMuscleGroupIdAndUserId(@Body() { muscleGroupId, userId }: { muscleGroupId: number, userId: number }) {
        return this.exercisesService.findExercisesByMuscleGroupIdAndUserId(userId, muscleGroupId);
    }
}
