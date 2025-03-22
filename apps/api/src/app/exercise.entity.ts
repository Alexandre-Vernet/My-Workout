import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ExerciseMuscleEntity } from './exerciseMuscle.entity';

@Entity({ name: 'exercise', schema: 'public' })
export class ExerciseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @OneToMany(
    () => ExerciseMuscleEntity,
    (exerciseMuscle) => exerciseMuscle.id,
    { onDelete: 'CASCADE' }
  )
  exerciseMuscle: ExerciseMuscleEntity[];
}
