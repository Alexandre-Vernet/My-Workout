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
        private jwtService: JwtService
    ) {
    }

    async signUp(user: User) {
        if (user.password.trim() !== user.confirmPassword.trim()) {
            throw new FormBadRequestException(ErrorCode.passwordNotMatch, 'Passwords do not match', 'password');
        }

        const existingUser = await this.userRepository.findOne({ where: { email: user.email } });
        if (existingUser) {
            throw new FormBadRequestException(ErrorCode.emailAlreadyInUse, 'This email is already taken', 'email');
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
            throw new FormBadRequestException(ErrorCode.invalidCredential, 'Email or password is incorrect', 'email');
        }


        delete user.password;
        return {
            accessToken: await this.jwtService.signAsync({ user }),
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


    async updatePassword(userId: number, password: string, confirmPassword: string) {
        if (password !== confirmPassword) {
            throw new FormBadRequestException(ErrorCode.passwordNotMatch, 'Passwords do not match', 'password');
        }
        const options: FindOneOptions = {
            where: {
                id: userId
            }
        };

        const user = this.userRepository.findOne(options);
        if (!user) {
            throw new ConflictException('Invalid credentials');
        }

        // Hash security
        const hashedPassword = await bcrypt.hash(password, 10);
        if (!hashedPassword) {
            throw new ConflictException('Something went wrong. Please try again later.');
        }
        return this.userRepository.update(userId, { password: hashedPassword });
    }

    // sendEmailForgotPassword(email: string) {
    //   const options: FindOneOptions = {
    //     where: {
    //       email
    //     }
    //   };
    //
    //   this.userRepository.findOne(options)
    //     .then(user => {
    //       if (user) {
    //         // Generate URL with token
    //         const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN;
    //         const token = this.jwtService.sign({ user });
    //         const linkResetPassword = `${ ALLOWED_ORIGIN }/auth/reset-password?token=${ token }`;
    //         return this.emailService.sendEmailResetPassword(user, linkResetPassword);
    //       }
    //     });
    // }
}
