import { User } from './user';

export interface JwtPayload {
    user: User;
    iat: number;
    exp: number;
}
