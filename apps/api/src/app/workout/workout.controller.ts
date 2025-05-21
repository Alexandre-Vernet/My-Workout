import { Body, Controller, Delete, Get, Param, Post, Query, Req, UseInterceptors } from '@nestjs/common';
import { AuthInterceptor } from '../auth/auth.interceptor';
import { WorkoutService } from './workout.service';
import { Workout } from '../../../../../libs/interfaces/workout';
import { AuthService } from '../auth/auth.service';

@UseInterceptors(AuthInterceptor)
@Controller('workout')
export class WorkoutController {

    constructor(
        private readonly workoutService: WorkoutService,
        private readonly authService: AuthService
    ) {
    }

    @Post()
    create(@Req() request: Request, @Body() workout: Workout) {
        const token = request.headers['authorization'].split(' ')[1];
        workout.user = this.authService.verifyToken(token);
        return this.workoutService.create(workout);
    }

    @Get()
    find(@Req() request: Request) {
        const token = request.headers['authorization'].split(' ')[1];
        const user = this.authService.verifyToken(token);
        return this.workoutService.find(user.id);
    }

    @Get('duplicate-workout')
    checkDuplicateWorkout(@Req() request: Request, @Query('muscleGroupId') muscleGroupId: string) {
        const token = request.headers['authorization'].split(' ')[1];
        const user = this.authService.verifyToken(token);
        return this.workoutService.checkDuplicateWorkout(user.id, Number(muscleGroupId));
    }

    @Get(':id')
    findById(@Param('id') id: string) {
        return this.workoutService.findById(Number(id));
    }

    @Delete()
    deleteByUserId(@Req() request: Request, @Query('id') id: number) {
        const token = request.headers['authorization'].split(' ')[1];
        const user = this.authService.verifyToken(token);
        return this.workoutService.delete(user.id, Number(id));
    }
}
