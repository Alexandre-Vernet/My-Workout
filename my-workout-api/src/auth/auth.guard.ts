import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ErrorCode } from '../interfaces/error-code';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly authService: AuthService
    ) {
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        const token: string = request.headers.authorization?.split(' ')[1];

        if (!token) {
            throw new UnauthorizedException(ErrorCode.userMustBeLoggedToContinue);
        }

        const user = await this.authService.me(token);

        if (!user) {
            throw new UnauthorizedException(ErrorCode.sessionHasExpired);
        }

        request.user = user;
        request.accessToken = token;

        return true;
    }
}
