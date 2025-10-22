import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { HistoryService } from './history.service';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user-decorator';
import { User } from '../interfaces/user';
import { History } from '../interfaces/history';

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

    @Get('last')
    findLastHistoryWeightByExerciseId(@CurrentUser() user: User, @Query('exerciseId') exerciseId: number) {
        return this.historyService.findLastHistoryWeightByExerciseId(user.id, exerciseId);
    }

    @Get('today')
    findTodayExercices(@CurrentUser() user: User, @Query('muscleGroupId') muscleGroupId: number, @Query('exerciseId') exerciseId: number) {
        return this.historyService.findTodayExercices(user.id, muscleGroupId, exerciseId);
    }

    @Get('graphs')
    graphs(@CurrentUser() user: User, @Query('exerciseId') exerciseId: number) {
        return this.historyService.graphs(user.id, exerciseId);
    }

    @Get('count-total-weight')
    countTotalWeight(@CurrentUser() user: User, @Query('exerciseId') exerciseId: number) {
        return this.historyService.countTotalWeight(user.id, exerciseId);
    }

    @Get('count-total-reps')
    countTotalReps(@CurrentUser() user: User, @Query('exerciseId') exerciseId: number) {
        return this.historyService.countTotalReps(user.id, exerciseId);
    }

    @Get('count-max-weight')
    countMaxWeight(@CurrentUser() user: User, @Query('exerciseId') exerciseId: number) {
        return this.historyService.countMaxWeight(user.id, exerciseId);
    }

    @Put(':id')
    update(@CurrentUser() user: User, @Body() history: History) {
        history.user = user;
        return this.historyService.update(history);
    }

    @Delete('delete-ids')
    deleteIds(@CurrentUser() user: User, @Body('id') ids: number[]) {
        return this.historyService.deleteIds(user.id, ids);
    }

    @Delete(':historyId')
    delete(@Param('historyId') historyId: number) {
        return this.historyService.delete(historyId);
    }
}
