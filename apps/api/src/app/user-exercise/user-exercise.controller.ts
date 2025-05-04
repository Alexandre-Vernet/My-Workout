import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { UserExerciseService } from './user-exercise.service';
import { Workout } from '../../../../../libs/interfaces/workout';
import { AuthInterceptor } from '../auth/auth.interceptor';

@UseInterceptors(AuthInterceptor)
@Controller('user-exercise')
export class UserExerciseController {
    constructor(private readonly userExerciseService: UserExerciseService) {
    }

    @Post()
    create(@Body() workout: Workout) {
        return this.userExerciseService.create(workout);
    }
}
