import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn
} from 'typeorm';
import { MuscleGroupEntity } from '../muscle-group/muscle-group.entity';
import { ExerciseMuscleEntity } from '../exercise-muscle/exercise-muscle.entity';

@Entity({ name: 'muscles', schema: 'public' })
export class MuscleEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(() => MuscleGroupEntity, (muscleGroup) => muscleGroup.muscle)
    @JoinColumn({ name: 'muscle_group_id' })
    muscleGroup: MuscleGroupEntity;

    @Column()
    name: string;

    @OneToMany(() => ExerciseMuscleEntity, (exerciseMuscle) => exerciseMuscle.muscle)
    exerciseMuscle: ExerciseMuscleEntity[];
}
