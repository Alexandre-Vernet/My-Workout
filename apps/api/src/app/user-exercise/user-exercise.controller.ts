import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UserExerciseService } from './user-exercise.service';
import { UserExercise } from '../../../../../libs/interfaces/user-exercise';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user-decorator';
import { User } from '../../../../../libs/interfaces/user';

@UseGuards(AuthGuard)
@Controller('user-exercise')
export class UserExerciseController {

    constructor(
        private readonly userExerciseService: UserExerciseService
    ) {
    }

    @Post()
    create(@CurrentUser() user: User, @Body() userExercise: UserExercise) {
        userExercise.user = user;
        return this.userExerciseService.create(userExercise);
    }
}
