import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { ExercisesEntity } from '../exercises/exercises.entity';
import { MuscleGroupEntity } from '../muscle-group/muscle-group.entity';

@Entity({ name: 'workout', schema: 'public' })
export class WorkoutEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(() => UserEntity, user => user.userExercise, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;

    @ManyToOne(() => MuscleGroupEntity, muscleGroupEntity => muscleGroupEntity.id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'muscle_group_id' })
    exercise: ExercisesEntity;
    
    @Column()
    date: Date;
}
