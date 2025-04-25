import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { HistoryService } from './history.service';
import { History } from '../../../../../libs/interfaces/history';

@Controller('history')
export class HistoryController {
    constructor(private readonly historyService: HistoryService) {}

    @Post()
    create(@Body() history: History) {
        return this.historyService.create(history);
    }

    @Get()
    findAll() {
        return this.historyService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.historyService.findOne(id);
    }

    @Patch(':id')
    update(
        @Param('id') id: number,
        @Body() updateHistoryDto: History
    ) {
        return this.historyService.update(id, updateHistoryDto);
    }

    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.historyService.remove(+id);
    }
}
