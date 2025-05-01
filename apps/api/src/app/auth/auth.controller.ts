import { Body, Controller, HttpCode, Post, Put, Delete, Req, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthInterceptor } from './auth.interceptor';
import { User } from '../../../../../libs/interfaces/user';

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

    @UseInterceptors(AuthInterceptor)
    @Put()
    updateUser(@Req() request: Request, @Body() { user }: { user: User }) {
        const token = request.headers['authorization'].split(' ')[1];
        return this.authService.updateUser(token, user);
    }

    @UseInterceptors(AuthInterceptor)
    @Delete()
    deleteUser(@Req() request: Request) {
        const token = request.headers['authorization'].split(' ')[1];
        return this.authService.deleteUser(token);
    }

    // @HttpCode(200)
    // @Post('send-email-reset-password')
    // sendEmailForgotPassword(@Body() body: { email: string }) {
    //   return this.authService.sendEmailForgotPassword(body.email);
    // }
}
