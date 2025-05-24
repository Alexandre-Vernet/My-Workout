import { Body, Controller, Delete, HttpCode, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { User } from '../../../../../libs/interfaces/user';
import { CurrentUser } from './current-user-decorator';

@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService
    ) {
    }

    @HttpCode(201)
    @Post('sign-up')
    signUp(@Body() user: User) {
        return this.authService.signUp(user);
    }

    @HttpCode(200)
    @Post('sign-in')
    signIn(@Body() user: User) {
        return this.authService.signIn(user);
    }

    @HttpCode(200)
    @Post('sign-in-with-access-token')
    async signInWithAccessToken(@Body() { accessToken }: { accessToken: string }) {
        return await this.authService.signInWithAccessToken(accessToken);
    }

   @UseGuards(AuthGuard)
    @Put()
    updateUser(@CurrentUser() currentUser: User, @Body() { user }: { user: User }) {
        return this.authService.updateUser(currentUser, user);
    }

   @UseGuards(AuthGuard)
    @Delete()
    deleteUser(@CurrentUser() user: User) {
        return this.authService.deleteUser(user);
    }

    @HttpCode(200)
    @Post('send-email-reset-password')
    sendEmailForgotPassword(@Body() { email }: { email: string }) {
        return this.authService.sendEmailForgotPassword(email);
    }

    @Put('reset-password/:userId')
    updatePassword(@Param('userId') userId: number, @Body() { password }: { password: string }) {
        return this.authService.updatePassword(Number(userId), password);
    }

    @Post('verify-token')
    verifyToken(@Body() { token }: { token: string }) {
        return this.authService.verifyToken(token);
    }
}
