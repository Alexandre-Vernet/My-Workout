import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MuscleGroupEntity } from './muscleGroup.entity';
import { ExerciseMuscleEntity } from './exerciseMuscle.entity';

@Entity({ name: 'muscle', schema: 'public' })
export class MuscleEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => MuscleGroupEntity, (muscleGroup) => muscleGroup.id, {
    cascade: true,
    eager: true,
  })
  @JoinColumn({ name: 'muscle_group_id' })
  muscleGroup: MuscleGroupEntity[];

  @Column()
  name: string;

  @OneToMany(
    () => ExerciseMuscleEntity,
    (exerciseMuscle) => exerciseMuscle.id,
    { onDelete: 'CASCADE' }
  )
  exerciseMuscle: ExerciseMuscleEntity[];
}
