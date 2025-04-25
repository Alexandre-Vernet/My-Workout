import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ExercisesEntity } from '../exercises/exercises.entity';
import { UserEntity } from '../user/user.entity';

@Entity({ name: 'history', schema: 'public' })
export class HistoryEntity {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(() => ExercisesEntity, (exercise) => exercise.id, {
        cascade: true,
        eager: true
    })
    @JoinColumn({ name: 'exercise_id' })
    exercise: ExercisesEntity;

    @ManyToOne(() => UserEntity, (user) => user.id, {
        cascade: true,
        eager: true
    })
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;

    @Column()
    weight: number;

    @Column({ name: 'created_at' })
    createdAt: Date;
}
