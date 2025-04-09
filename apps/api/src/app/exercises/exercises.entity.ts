import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ExerciseMuscleEntity } from '../exerciseMuscle.entity';

@Entity({ name: 'exercise', schema: 'public' })
export class ExercisesEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @OneToMany(() => ExerciseMuscleEntity, (exerciseMuscle) => exerciseMuscle.exercise, { onDelete: 'CASCADE' })
  exerciseMuscle: ExerciseMuscleEntity[];
}
