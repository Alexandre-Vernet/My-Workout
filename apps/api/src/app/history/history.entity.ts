import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ExercisesEntity } from '../exercises/exercises.entity';
import { WorkoutEntity } from '../workout/workout.entity';

@Entity({ name: 'history', schema: 'public' })
export class HistoryEntity {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(() => ExercisesEntity, (exercise) => exercise.history, { eager: true })
    @JoinColumn({ name: 'exercise_id' })
    exercise: ExercisesEntity;

    @ManyToOne(() => WorkoutEntity, workout => workout.history, { eager: true })
    @JoinColumn({ name: 'workout_id' })
    workout: WorkoutEntity;

    @Column({ type: 'float' })
    weight: number;

    @Column({ name: 'created_at' })
    createdAt: Date;
}
