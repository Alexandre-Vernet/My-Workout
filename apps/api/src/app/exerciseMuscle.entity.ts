import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ExercisesEntity } from './exercises/exercises.entity';
import { MuscleEntity } from './muscle.entity';

@Entity({ name: 'exercise_muscle', schema: 'public' })
export class ExerciseMuscleEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => ExercisesEntity, (exercise) => exercise.id, {
    cascade: true,
    eager: true,
  })
  @JoinColumn({ name: 'exercise_id' })
  exercise: ExercisesEntity;

  @ManyToOne(() => MuscleEntity, (muscle) => muscle.id, {
    cascade: true,
    eager: true,
  })
  @JoinColumn({ name: 'muscle_id' })
  muscle: MuscleEntity;
}
