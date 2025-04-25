import { Body, Controller, Post } from '@nestjs/common';
import { UserExerciseService } from './user-exercise.service';
import { Workout } from '../../../../../libs/interfaces/workout';

@Controller('user-exercise')
export class UserExerciseController {
    constructor(private readonly userExerciseService: UserExerciseService) {
    }

    @Post()
    create(@Body() workout: Workout) {
        return this.userExerciseService.create(workout);
    }
}
