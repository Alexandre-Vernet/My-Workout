import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HistoryEntity } from './history.entity';
import { Repository } from 'typeorm';
import { History } from '../../../../../libs/interfaces/history';

@Injectable()
export class HistoryService {

    constructor(
        @InjectRepository(HistoryEntity)
        private readonly historyEntity: Repository<HistoryEntity>
    ) {
    }

    create(history: History) {
        return this.historyEntity.save(history);
    }

    findAll() {
        return `This action returns all history`;
    }

    findOne(id: number) {
        return `This action returns a #${ id } history`;
    }

    update(id: number, history: History) {
        return `This action updates a #${ id } history`;
    }

    remove(id: number) {
        return `This action removes a #${ id } history`;
    }
}
