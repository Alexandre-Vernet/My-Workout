import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ExercisesEntity } from '../exercises/exercises.entity';
import { MuscleEntity } from '../muscle/muscle.entity';

@Entity({ name: 'exercise_muscle', schema: 'public' })
export class ExerciseMuscleEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(() => ExercisesEntity, (exercise) => exercise.exerciseMuscle)
    @JoinColumn({ name: 'exercise_id' })
    exercise: ExercisesEntity;

    @ManyToOne(() => MuscleEntity, (muscle) => muscle.exerciseMuscle)
    @JoinColumn({ name: 'muscle_id' })
    muscle: MuscleEntity;
}
