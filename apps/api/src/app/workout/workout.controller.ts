import { Body, Controller, Delete, Get, Param, UseInterceptors } from '@nestjs/common';
import { AuthInterceptor } from '../auth/auth.interceptor';
import { WorkoutService } from './workout.service';

@UseInterceptors(AuthInterceptor)
@Controller('workout')
export class WorkoutController {

    constructor(
        private readonly workoutService: WorkoutService
    ) {
    }

    @Get(':userId')
    getHistoryAndMuscleGroupByUserId(@Param() { userId }: { userId: string }) {
        return this.workoutService.getWorkoutFromUserId(Number(userId));
    }

    @Delete(':userId')
    delete(@Param() { userId }: { userId: string }, @Body() { id }: { id: number }) {
        return this.workoutService.delete(Number(userId), id);
    }
}
