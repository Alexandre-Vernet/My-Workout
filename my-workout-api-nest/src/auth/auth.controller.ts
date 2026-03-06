import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/JwtAuth.guard';
import { CurrentUser } from './current-user-decorator';
import { User } from '../interfaces/user';

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

    @UseGuards(JwtAuthGuard)
    @HttpCode(200)
    @Get('me')
    async me(@CurrentUser() currentUser: User) {
        return await this.authService.me(currentUser);
    }

    @HttpCode(200)
    @Post('refresh')
    async refresh(@Body() { refreshToken }: { refreshToken: string }) {
        return await this.authService.refresh(refreshToken);
    }

   @UseGuards(JwtAuthGuard)
    @Put()
    updateUser(@CurrentUser() currentUser: User, @Body() { user }: { user: User }) {
        return this.authService.updateUser(currentUser, user);
    }

   @UseGuards(JwtAuthGuard)
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
