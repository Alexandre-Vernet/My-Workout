import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ExercisesEntity } from '../exercises/exercises.entity';
import { WorkoutEntity } from '../workout/workout.entity';

@Entity({ name: 'history', schema: 'public' })
export class HistoryEntity {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(() => ExercisesEntity, (exercise) => exercise.history)
    @JoinColumn({ name: 'exercise_id' })
    exercise: ExercisesEntity;

    @ManyToOne(() => WorkoutEntity, workout => workout.history)
    @JoinColumn({ name: 'workout_id' })
    workout: WorkoutEntity;

    @Column({ type: 'real' })
    weight: number;

    @Column()
    reps: number;
}
