import { Body, Controller, Get, Post, Query, UseInterceptors } from '@nestjs/common';
import { HistoryService } from './history.service';
import { History } from '../../../../../libs/interfaces/history';
import { AuthInterceptor } from '../auth/auth.interceptor';

@UseInterceptors(AuthInterceptor)
@Controller('history')
export class HistoryController {
    constructor(private readonly historyService: HistoryService) {
    }

    @Post()
    create(@Body() history: History) {
        return this.historyService.create(history);
    }

    @Get()
    findByUserId(@Query('userId') userId: string) {
        return this.historyService.findByUserId(Number(userId));
    }

    @Get('last')
    findLastHistoryWeightByExerciseId(@Query('userId') userId: number, @Query('exerciseId') exerciseId: number) {
        return this.historyService.findLastHistoryWeightByExerciseId(userId, exerciseId);
    }
}
