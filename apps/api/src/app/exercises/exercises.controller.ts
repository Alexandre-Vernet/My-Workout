import { Controller, Get, HttpCode, Query, Req, UseInterceptors } from '@nestjs/common';
import { ExercisesService } from './exercises.service';
import { AuthInterceptor } from '../auth/auth.interceptor';
import { AuthService } from '../auth/auth.service';

@Controller('exercises')
export class ExercisesController {
    constructor(
        private readonly exercisesService: ExercisesService,
        private readonly authService: AuthService
    ) {
    }

    @Get('find-all-exercises-by-muscle-group-id')
    findAllExercisesByMuscleGroupIdAndUserId(@Req() request: Request, @Query('muscleGroupId') muscleGroupId: string) {
        let user = null;

        try {
            const authHeader = request.headers['authorization'];
            if (authHeader?.startsWith('Bearer ')) {
                const token = authHeader.split(' ')[1];
                user = this.authService.verifyToken(token);
            }
        } catch (e) {
            user = null;
        }

        return this.exercisesService.findAllExercisesByMuscleGroupId(Number(muscleGroupId), user);
    }


    @UseInterceptors(AuthInterceptor)
    @Get('find-added-exercises-by-muscle-group-id')
    @HttpCode(200)
    findAddedExercisesByMuscleGroupId(@Req() request: Request, @Query('muscleGroupId') muscleGroupId: string) {
        const token = request.headers['authorization'].split(' ')[1];
        const user = this.authService.verifyToken(token);
        return this.exercisesService.findAddedExercisesByMuscleGroupId(user.id, Number(muscleGroupId));
    }

    @UseInterceptors(AuthInterceptor)
    @Get('find-cardio-exercises')
    findCardioExercises(@Req() request: Request) {
        const token = request.headers['authorization'].split(' ')[1];
        const user = this.authService.verifyToken(token);
        return this.exercisesService.findCardioExercises(user.id);
    }
}
