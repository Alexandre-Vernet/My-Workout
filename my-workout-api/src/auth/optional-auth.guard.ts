import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from "../interfaces/jwt-payload";

@Injectable()
export class OptionalAuthGuard implements CanActivate {
    constructor(
        private readonly authService: AuthService
    ) {
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        const token: string = request.headers.authorization?.split(' ')[1];

        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET) as JwtPayload;
            const user = await this.authService.me(decoded.user);

            if (user) {
                request.user = user;
            }
        }
        return true;
    }
}
