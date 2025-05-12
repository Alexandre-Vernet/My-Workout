import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { MuscleEntity } from '../muscle/muscle.entity';
import { WorkoutEntity } from '../workout/workout.entity';

@Entity({ name: 'muscle_group', schema: 'public' })
export class MuscleGroupEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    name: string;

    @OneToMany(() => MuscleEntity, (muscle) => muscle.muscleGroup, { onDelete: 'CASCADE' })
    muscle: MuscleEntity[];

    @OneToMany(() => WorkoutEntity, workoutEntity => workoutEntity.muscleGroup, { onDelete: 'CASCADE' })
    workout: WorkoutEntity[];
}
