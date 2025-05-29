import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ExerciseMuscleEntity } from '../exercise-muscle/exercise-muscle.entity';
import { UserExerciseEntity } from '../user-exercise/user-exercise.entity';
import { HistoryEntity } from '../history/history.entity';

@Entity({ name: 'exercises', schema: 'public' })
export class ExercisesEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column({ name: 'is_smart_workout' })
    isSmartWorkout: boolean;

    @Column()
    order: number;

    @OneToMany(() => ExerciseMuscleEntity, exerciseMuscle => exerciseMuscle.exercise)
    exerciseMuscle: ExerciseMuscleEntity[];

    @OneToMany(() => UserExerciseEntity, userExercise => userExercise.exercise)
    userExercise: UserExerciseEntity[];

    @OneToMany(() => HistoryEntity, history => history.exercise)
    history: HistoryEntity[];
}
