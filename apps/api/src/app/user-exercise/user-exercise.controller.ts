import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { UserExerciseService } from './user-exercise.service';
import { UserExercise } from '../../../../../libs/interfaces/user-exercise';
import { AuthInterceptor } from '../auth/auth.interceptor';

@UseInterceptors(AuthInterceptor)
@Controller('user-exercise')
export class UserExerciseController {
    constructor(private readonly userExerciseService: UserExerciseService) {
    }

    @Post()
    create(@Body() userExercise: UserExercise) {
        return this.userExerciseService.create(userExercise);
    }
}
