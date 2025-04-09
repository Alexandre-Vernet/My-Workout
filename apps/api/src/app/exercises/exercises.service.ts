import { Injectable } from '@nestjs/common';
import { ExercisesEntity } from './exercises.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ExercisesService {
  constructor(
    @InjectRepository(ExercisesEntity)
    private readonly exerciseEntityRepository: Repository<ExercisesEntity>
  ) {}

  findExercisesByMuscleGroupId(muscleGroupId: number) {
    return this.exerciseEntityRepository.find({
      where: {
        exerciseMuscle: {
          muscle: {
            muscleGroup: {
              id: muscleGroupId,
            },
          },
        },
      },
    });
  }
}
