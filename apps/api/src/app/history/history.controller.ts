import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { HistoryService } from './history.service';
import { History } from '../../../../../libs/interfaces/history';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user-decorator';
import { User } from '../../../../../libs/interfaces/user';

@UseGuards(AuthGuard)
@Controller('history')
export class HistoryController {
    constructor(
        private readonly historyService: HistoryService
    ) {
    }

    @Post()
    create(@CurrentUser() user: User, @Body() history: History) {
        history.user = user;
        return this.historyService.create(history);
    }

    @Get()
    find(@CurrentUser() user: User) {
        return this.historyService.find(user.id);
    }

    @Get('last')
    findLastHistoryWeightByExerciseId(@CurrentUser() user: User, @Query('exerciseId') exerciseId: number) {
        return this.historyService.findLastHistoryWeightByExerciseId(user.id, exerciseId);
    }

    @Get('today')
    findTodayExercicesHistory(@CurrentUser() user: User, @Query('muscleGroupId') muscleGroupId: number, @Query('exerciseId') exerciseId: number) {
        return this.historyService.existingWorkout(user.id, muscleGroupId, exerciseId);
    }

    @Get('graphs')
    graphs(@CurrentUser() user: User, @Query('exerciseId') exerciseId: number) {
        return this.historyService.graphs(user.id, exerciseId);
    }
}
