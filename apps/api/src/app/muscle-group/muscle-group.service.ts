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
}
