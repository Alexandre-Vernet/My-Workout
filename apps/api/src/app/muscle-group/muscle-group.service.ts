import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MuscleGroupEntity } from './muscle-group.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MuscleGroupService {
    constructor(
        @InjectRepository(MuscleGroupEntity)
        private readonly muscleGroupRepository: Repository<MuscleGroupEntity>
    ) {
    }

    findAll() {
        return this.muscleGroupRepository.find();
    }

    findById(muscleGroupId: number) {
        return this.muscleGroupRepository.findOne({
            where: {
                id: muscleGroupId
            }
        });
    }



    suggestMuscleGroup(userId: number) {
        return this.muscleGroupRepository.createQueryBuilder('muscleGroup')
            .innerJoin('muscleGroup.muscle', 'm')
            .innerJoin('m.exerciseMuscle', 'em')
            .innerJoin('em.exercise', 'e')
            .innerJoin('e.history', 'h')
            .select([
                'muscleGroup.id as id',
                'muscleGroup.name as name'
            ])
            .where('h.user.id = :userId', { userId })
            .groupBy('muscleGroup.id, muscleGroup.name')
            .orderBy('MAX(h.createdAt)', 'ASC')
            .limit(1)
            .getRawOne();
    }
}
