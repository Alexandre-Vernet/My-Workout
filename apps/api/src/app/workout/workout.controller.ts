import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { WorkoutService } from './workout.service';
import { Workout } from '../../../../../libs/interfaces/workout';
import { CurrentUser } from '../auth/current-user-decorator';
import { User } from '../../../../../libs/interfaces/user';

@UseGuards(AuthGuard)
@Controller('workout')
export class WorkoutController {

    constructor(
        private readonly workoutService: WorkoutService
    ) {
    }

    @Post()
    create(@CurrentUser() user: User, @Body() workout: Workout) {
        workout.user = user;
        return this.workoutService.create(workout);
    }

    @Get('find-by-date')
    findByDate(@CurrentUser() user: User, @Query('start') start: string, @Query('end') end: string) {
        return this.workoutService.findByDate(user.id, new Date(start), new Date(end));
    }

    @Get()
    find(@CurrentUser() user: User) {
        return this.workoutService.find(user.id);
    }

    @Get('count-total-days-workout')
    countTotalDaysWorkout(@CurrentUser() user: User) {
        return this.workoutService.countTotalDaysWorkout(user.id);
    }

    @Get(':id')
    findById(@Param('id') id: string) {
        return this.workoutService.findById(Number(id));
    }

    @Delete()
    delete(@CurrentUser() user: User, @Query('id') id: number) {
        return this.workoutService.delete(user.id, Number(id));
    }
}
