import { Body, Controller, HttpCode, Post, UseInterceptors } from '@nestjs/common';
import { ExercisesService } from './exercises.service';
import { AuthInterceptor } from '../auth/auth.interceptor';

@Controller('exercises')
export class ExercisesController {
    constructor(private readonly exercisesService: ExercisesService) {
    }

    @Post('find-all-exercises-by-muscle-group-id')
    @HttpCode(200)
    findAllExercisesByMuscleGroupI(@Body() { muscleGroupId }: { muscleGroupId: number }) {
        return this.exercisesService.findAllExercisesByMuscleGroupId(muscleGroupId);
    }

    @UseInterceptors(AuthInterceptor)
    @Post('find-all-exercises-by-muscle-group-id-and-user-id')
    @HttpCode(200)
    findAllExercisesByMuscleGroupIdAndUserId(@Body() { muscleGroupId, userId }: {
        muscleGroupId: number,
        userId: number
    }) {
        return this.exercisesService.findAllExercisesByMuscleGroupIdAndUserId(userId, muscleGroupId);
    }

    @UseInterceptors(AuthInterceptor)
    @Post('find-exercises-by-muscle-group-id-and-user-id')
    @HttpCode(200)
    findExercisesByMuscleGroupIdAndUserId(@Body() { muscleGroupId, userId }: {
        muscleGroupId: number,
        userId: number
    }) {
        return this.exercisesService.findExercisesByMuscleGroupIdAndUserId(userId, muscleGroupId);
    }
}
