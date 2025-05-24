import { ConflictException, Injectable } from '@nestjs/common';
import { FindOneOptions, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/user.entity';
import bcrypt from 'bcrypt';
import { FormBadRequestException } from '../exceptions/FormBadRequestException';
import { User } from '../../../../../libs/interfaces/user';
import { ErrorCode } from '../../../../../libs/error-code/error-code';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private readonly jwtService: JwtService
    ) {
    }

    async signUp(user: User) {
        if (user.password.trim() !== user.confirmPassword.trim()) {
            throw new FormBadRequestException(ErrorCode.passwordNotMatch, 'password');
        }

        const existingUser = await this.userRepository.findOne({ where: { email: user.email } });
        if (existingUser) {
            throw new FormBadRequestException(ErrorCode.emailAlreadyInUse, 'email');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(user.password, 10);
        if (!hashedPassword) {
            throw new ConflictException('Something went wrong. Please try again later.');
        }
        user.password = hashedPassword;
        user.createdAt = new Date();
        user.updatedAt = new Date();

        return this.userRepository.save(user)
            .then(async (user) => {
                const accessToken = this.jwtService.sign({ user });
                return await this.signInWithAccessToken(accessToken);
            });
    }

    async signIn(user: User) {
        const options: FindOneOptions = {
            where: {
                email: user.email
            }
        };

        const existingUser = await this.userRepository.findOne(options);
        const isValid = existingUser && await bcrypt.compare(user.password, existingUser.password);

        if (!isValid) {
            throw new FormBadRequestException(ErrorCode.invalidCredential, 'email');
        }


        delete user.password;
        return {
            accessToken: await this.jwtService.signAsync({ user: existingUser }),
            user
        };
    }

    async signInWithAccessToken(accessToken: string) {
        return this.jwtService.verifyAsync(accessToken)
            .then(async (decoded) => {
                const user = await this.userRepository.findOne({
                    where: {
                        id: decoded.user.id
                    }
                });
                if (!user) {
                    throw new ConflictException('Invalid credentials');
                }
                delete user.password;
                return {
                    accessToken: await this.jwtService.signAsync({ user }),
                    user
                };
            })
            .catch(() => {
                throw new ConflictException('Your session has expired. Please sign in again.');
            });
    }


    async updateUser(currentUser: User, user: User) {
        const existingUser = await this.userRepository.findOne({
            where: {
                id: currentUser.id
            }
        });
        if (!existingUser) {
            throw new ConflictException('Invalid credentials');
        }

        if (existingUser.email !== user?.email) {
            await this.userRepository.update(currentUser.id, {
                email: user.email
            });
        }


        if (user.password) {
            if (user.password !== user.confirmPassword) {
                throw new FormBadRequestException(ErrorCode.passwordNotMatch, 'password');
            }
            const hashedPassword = await bcrypt.hash(user.password, 10);
            if (!hashedPassword) {
                throw new ConflictException('Something went wrong. Please try again later.');
            }
            await this.userRepository.update(currentUser.id, {
                password: hashedPassword
            });
        }

        return this.userRepository.findOne({
            where: {
                id: currentUser.id
            }
        });
    }

    async deleteUser(user: User) {
        const existingUser = await this.userRepository.findOne({ where: { id: user.id } });
        if (!existingUser) {
            throw new ConflictException('Invalid credentials');
        }

        return this.userRepository.delete(user.id);
    }

    async sendEmailForgotPassword(email: string) {
        const options: FindOneOptions = {
            where: {
                email
            }
        };

        const existingUser = await this.userRepository.findOne(options);

        const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN;
        const token = this.jwtService.sign({ existingUser });
        return { linkResetPassword: `${ ALLOWED_ORIGIN }/auth/reset-password?token=${ token }` };
    }

    async updatePassword(id: number, password: string) {
        const hashedPassword = await bcrypt.hash(password, 10);
        if (!hashedPassword) {
            throw new ConflictException('Something went wrong. Please try again later.');
        }
        await this.userRepository.update(id, {
            password: hashedPassword
        });

        const user = await this.userRepository.find({
            where: {
                id: id
            }
        });

        return {
            accessToken: await this.jwtService.signAsync({ user }),
            user
        };
    }

    verifyToken(token: string) {
        const decoded = this.jwtService.verify(token);
        if (!decoded) {
            throw new ConflictException('Invalid credentials');
        }

        const user: User = decoded.user;

        return user;
    }
}
