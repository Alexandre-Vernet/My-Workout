import { Body, Controller, Get, Post, Query, Req, UseInterceptors } from '@nestjs/common';
import { HistoryService } from './history.service';
import { History } from '../../../../../libs/interfaces/history';
import { AuthInterceptor } from '../auth/auth.interceptor';
import { AuthService } from '../auth/auth.service';

@UseInterceptors(AuthInterceptor)
@Controller('history')
export class HistoryController {
    constructor(
        private readonly historyService: HistoryService,
        private readonly authService: AuthService
    ) {
    }

    @Post()
    create(@Req() request: Request, @Body() history: History) {
        const token = request.headers['authorization'].split(' ')[1];
        history.user = this.authService.verifyToken(token);
        return this.historyService.create(history);
    }

    @Get()
    find(@Req() request: Request) {
        const token = request.headers['authorization'].split(' ')[1];
        const user = this.authService.verifyToken(token);
        return this.historyService.find(user.id);
    }

    @Get('last')
    findLastHistoryWeightByExerciseId(@Req() request: Request, @Query('exerciseId') exerciseId: number) {
        const token = request.headers['authorization'].split(' ')[1];
        const user = this.authService.verifyToken(token);
        return this.historyService.findLastHistoryWeightByExerciseId(user.id, exerciseId);
    }
}
