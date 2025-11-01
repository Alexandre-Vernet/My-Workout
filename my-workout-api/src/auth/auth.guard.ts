import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CustomBadRequestException } from '../exceptions/CustomBadRequestException';
import { ErrorCode } from '../interfaces/error-code';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly authService: AuthService
    ) {
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        const token = request.headers.authorization?.split(' ')[1];

        if (!token) {
            throw new CustomBadRequestException(ErrorCode.userMustBeLoggedToContinue);
        }

        const { user } = await this.authService.signInWithAccessToken(token);

        if (!user) {
            throw new CustomBadRequestException(ErrorCode.sessionHasExpired);
        }

        request.user = user;

        return true;
    }
}
