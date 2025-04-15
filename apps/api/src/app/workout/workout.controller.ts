import { Body, Controller, Post } from '@nestjs/common';
import { WorkoutService } from './workout.service';
import { Workout } from '../../../../../libs/interfaces/workout';

@Controller('workout')
export class WorkoutController {
    constructor(private readonly workoutService: WorkoutService) {
    }

    @Post()
    create(@Body() workout: Workout) {
        return this.workoutService.create(workout);
    }
}
