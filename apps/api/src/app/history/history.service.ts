import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HistoryEntity } from './history.entity';
import { In, Repository } from 'typeorm';
import { History } from '../../../../../libs/interfaces/history';
import { MuscleGroup, renameMuscleGroupMap } from '../../../../../libs/interfaces/MuscleGroup';

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

    async getHistoryAndMuscleGroupByUserId(userId: number) {
        const muscleGroups: MuscleGroup[] = await this.historyEntity
            .createQueryBuilder('h')
            .innerJoin('h.exercise', 'e')
            .innerJoin('e.exerciseMuscle', 'em')
            .innerJoin('em.muscle', 'm')
            .innerJoin('m.muscleGroup', 'mg')
            .select('DATE_TRUNC(\'day\', h.createdAt)', 'date')
            .addSelect('ARRAY_AGG(DISTINCT h.id)', 'ids')
            .addSelect('ARRAY_AGG(DISTINCT mg.name)', 'muscleGroups')
            .where('h.user.id = :userId', { userId })
            .groupBy('DATE_TRUNC(\'day\', h.createdAt)')
            .orderBy('DATE_TRUNC(\'day\', h.createdAt)', 'DESC')
            .getRawMany();


        muscleGroups.forEach(m => {
            m.muscleGroups = m.muscleGroups.map(name => renameMuscleGroupMap[name] ?? name);
        });

        return muscleGroups;
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

    async delete(userId: number, ids: number[]) {
        const historyEntities = await this.historyEntity.find({
            where: {
                user: {
                    id: userId
                },
                id: In(ids)
            }
        });

        await this.historyEntity.delete(historyEntities.map(h => h.id));

        return { deletedIds: ids };
    }
}
