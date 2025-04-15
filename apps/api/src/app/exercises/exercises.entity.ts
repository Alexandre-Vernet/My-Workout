import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ExerciseMuscleEntity } from '../exerciseMuscle.entity';
import { WorkoutEntity } from '../workout/workout.entity';

@Entity({ name: 'exercise', schema: 'public' })
export class ExercisesEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @OneToMany(() => ExerciseMuscleEntity, (exerciseMuscle) => exerciseMuscle.exercise, { onDelete: 'CASCADE' })
    exerciseMuscle: ExerciseMuscleEntity[];

    @OneToMany(() => WorkoutEntity, workout => workout.id, { onDelete: 'CASCADE' })
    workout: WorkoutEntity[];
}
