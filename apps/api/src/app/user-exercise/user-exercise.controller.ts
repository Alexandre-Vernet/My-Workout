import { Body, Controller, Post, Req, UseInterceptors } from '@nestjs/common';
import { UserExerciseService } from './user-exercise.service';
import { UserExercise } from '../../../../../libs/interfaces/user-exercise';
import { AuthInterceptor } from '../auth/auth.interceptor';
import { AuthService } from '../auth/auth.service';
import { CustomBadRequestException } from '../exceptions/CustomBadRequestException';
import { ErrorCode } from '../../../../../libs/error-code/error-code';

@UseInterceptors(AuthInterceptor)
@Controller('user-exercise')
export class UserExerciseController {

    constructor(
        private readonly userExerciseService: UserExerciseService,
        private readonly authService: AuthService
    ) {
    }

    @Post()
    create(@Req() request: Request, @Body() userExercise: UserExercise) {
        const authHeader = request.headers['authorization'];
        if (authHeader?.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            userExercise.user = this.authService.verifyToken(token);
            return this.userExerciseService.create(userExercise);
        }

        throw new CustomBadRequestException(ErrorCode.userMustBeLoggedToContinue);
    }
}
