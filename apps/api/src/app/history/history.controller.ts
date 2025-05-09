import { Body, Controller, Delete, Get, Param, Post, UseInterceptors } from '@nestjs/common';
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

    @Get(':userId')
    getHistoryAndMuscleGroupByUserId(@Param() { userId }: { userId: string }) {
        return this.historyService.getHistoryAndMuscleGroupByUserId(Number(userId));
    }

    @Get(':userId/:exerciseId')
    findLastHistoryWeightByExerciseId(@Param('userId') userId: number, @Param('exerciseId') exerciseId: number) {
        return this.historyService.findLastHistoryWeightByExerciseId(userId, exerciseId);
    }

    @Delete(':userId')
    delete(@Param() { userId }: { userId: string }, @Body() ids: number[]) {
        return this.historyService.delete(Number(userId), ids);
    }
}
