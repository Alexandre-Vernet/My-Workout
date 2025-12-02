import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { AuthService } from './auth.service';
import { JwtPayload } from "../interfaces/jwt-payload";

@Injectable()
export class OptionalAuthGuard implements CanActivate {
    constructor(private readonly authService: AuthService) {
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;

        if (authHeader) {
            const token = authHeader.split(' ')[1];

            try {
                const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET) as JwtPayload;
                const user = await this.authService.me(decoded.user);
                if (user) {
                    request.user = user;
                }
            } catch (err) {
                // Invalid token but authorize access
            }
        }

        return true;
    }
}
