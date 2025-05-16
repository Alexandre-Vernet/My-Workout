import { Body, Controller, Delete, Get, Post, Query, UseInterceptors } from '@nestjs/common';
import { AuthInterceptor } from '../auth/auth.interceptor';
import { WorkoutService } from './workout.service';
import { Workout } from '../../../../../libs/interfaces/workout';

@UseInterceptors(AuthInterceptor)
@Controller('workout')
export class WorkoutController {

    constructor(
        private readonly workoutService: WorkoutService
    ) {
    }

    @Post()
    create(@Body() { workout, forceCreateWorkout }: { workout: Workout, forceCreateWorkout: boolean }) {
        return this.workoutService.create(workout, forceCreateWorkout);
    }

    @Get()
    findByUserId(@Query() { userId }: { userId: string }) {
        return this.workoutService.findByUserId(Number(userId));
    }

    @Delete()
    deleteByUserId(@Query() { id, userId }: { id: string, userId: string }) {
        return this.workoutService.delete(Number(userId), Number(id));
    }
}
