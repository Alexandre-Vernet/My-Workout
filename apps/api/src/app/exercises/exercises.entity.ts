import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ExerciseMuscleEntity } from '../exercise-muscle/exercise-muscle.entity';
import { UserExerciseEntity } from '../user-exercise/user-exercise.entity';

@Entity({ name: 'exercises', schema: 'public' })
export class ExercisesEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @OneToMany(() => ExerciseMuscleEntity, (exerciseMuscle) => exerciseMuscle.exercise, { onDelete: 'CASCADE' })
    exerciseMuscle: ExerciseMuscleEntity[];

    @OneToMany(() => UserExerciseEntity, userExercise => userExercise.id, { onDelete: 'CASCADE' })
    userExercise: UserExerciseEntity[];
}
