import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { ExercisesEntity } from '../exercises/exercises.entity';

@Entity({ name: 'user_exercise', schema: 'public' })
export class UserExerciseEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(() => UserEntity, user => user.userExercise, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;

    @ManyToOne(() => ExercisesEntity, exercise => exercise.userExercise, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'exercise_id' })
    exercise: ExercisesEntity;

    @Column()
    order: number;
}
