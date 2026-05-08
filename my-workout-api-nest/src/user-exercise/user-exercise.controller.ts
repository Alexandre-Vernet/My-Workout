import { Body, Controller, Post, Put, UseGuards } from '@nestjs/common';
import { UserExerciseService } from './user-exercise.service';
import { JwtAuthGuard } from '../auth/guards/JwtAuth.guard';
import { CurrentUser } from '../auth/current-user-decorator';
import { User } from '../interfaces/user';
import { UserExercise } from '../interfaces/user-exercise';

@UseGuards(JwtAuthGuard)
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

    @Put()
    updateOrderExercises(@CurrentUser() user: User, @Body() userExercise: UserExercise[]) {
        userExercise.map(ue => ue.user = user);
        return this.userExerciseService.updateOrderExercises(userExercise);
    }
}
