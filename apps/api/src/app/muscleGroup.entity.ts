import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { MuscleEntity } from './muscle.entity';

@Entity({ name: 'muscle_group', schema: 'public' })
export class MuscleGroupEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @OneToMany(() => MuscleEntity, (muscle) => muscle.id, { onDelete: 'CASCADE' })
  muscle: MuscleEntity[];
}
