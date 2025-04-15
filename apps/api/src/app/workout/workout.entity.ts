import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { ExercisesEntity } from '../exercises/exercises.entity';

@Entity({ name: 'workout', schema: 'public' })
export class WorkoutEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(() => UserEntity, user => user.workout, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;

    @ManyToOne(() => ExercisesEntity, exercise => exercise.workout, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'exercise_id' })
    exercise: ExercisesEntity;
}
