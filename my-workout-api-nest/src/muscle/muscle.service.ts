import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MuscleEntity } from './muscle.entity';

@Injectable()
export class MuscleService {
    constructor(
        @InjectRepository(MuscleEntity)
        private readonly muscleRepository: Repository<MuscleEntity>,
    ) {}

    async findAllMuscle() {
        const muscles = await this.muscleRepository.find({
            relations: ['muscleGroup'],
            order: {
                muscleGroup: {
                    name: 'asc'
                }
            }
        });

        return muscles.reduce((acc, muscle) => {
            const groupName = muscle.muscleGroup.name;

            let group = acc.find(g => g.value === groupName);

            if (!group) {
                group = {
                    label: groupName,
                    value: groupName,
                    items: [],
                };
                acc.push(group);
            }

            group.items.push({
                id: muscle.id,
                name: muscle.name,
            });

            return acc;
        }, []);
    }
}
