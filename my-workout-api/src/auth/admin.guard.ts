import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from '../interfaces/jwt-payload';

@Injectable()
export class AdminGuard implements CanActivate {
    constructor(
        private readonly authService: AuthService
    ) {
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        const token: string = request.headers.authorization?.split(' ')[1];

        if (!token) {
            throw new UnauthorizedException();
        }

        let decoded: JwtPayload;
        try {
            decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET) as JwtPayload;
        } catch (e) {
            console.log(e);
            throw new ForbiddenException('Vous n\'êtes pas autorisé à ajoute un exercice');
        }

        const user = await this.authService.me(decoded.user);

        if (!user || !decoded) {
            return false;
        }

        if (!user.isAdmin) {
            throw new ForbiddenException('Vous n\'êtes pas autorisé à ajoute un exercice');
        }

        request.user = user;
        return true;

    }
}
