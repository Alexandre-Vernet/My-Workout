import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { HistoryService } from './history.service';
import { History } from '../../../../../libs/interfaces/history';

@Controller('history')
export class HistoryController {
    constructor(private readonly historyService: HistoryService) {}

    @Post()
    create(@Body() history: History) {
        return this.historyService.create(history);
    }

    @Get(':userId')
    getHistoryAndMuscleGroupByUserId(@Param() { userId }: {userId: string}) {
        return this.historyService.getHistoryAndMuscleGroupByUserId(Number(userId));
    }

    @Get(':userId/:exerciseId')
    findLastHistoryWeightByExerciseId(@Param('userId') userId: number, @Param('exerciseId') exerciseId: number) {
        return this.historyService.findLastHistoryWeightByExerciseId(userId, exerciseId);
    }
}
