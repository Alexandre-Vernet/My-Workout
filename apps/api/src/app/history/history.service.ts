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

    findLastHistoryWeightByExerciseId(userId: number, exerciseId: number) {
        return this.historyEntity.findOne({
            where: {
                exercise: {
                    id: exerciseId
                },
                user: {
                    id: userId
                }
            },
            order: {
                createdAt: 'DESC',
                weight: 'DESC'
            }
        });
    }
}
