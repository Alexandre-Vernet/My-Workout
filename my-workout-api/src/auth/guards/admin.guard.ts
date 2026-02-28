import { ForbiddenException, Injectable } from '@nestjs/common';
import { User } from '../../interfaces/user';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AdminGuard extends AuthGuard('jwt') {

    handleRequest(err: any, user: any, info: any) {
        const castedUser = user as User;
        if (err || info || !castedUser.isAdmin) {
            throw new ForbiddenException('Vous n\'êtes pas autorisé à ajouter un exercice');
        }

        return user;
    }
}
