import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserExerciseEntity } from '../user-exercise/user-exercise.entity';
import { WorkoutEntity } from '../workout/workout.entity';

@Entity({ name: 'users', schema: 'public' })
export class UserEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;

    @Column({name: 'is_admin', type: 'boolean'})
    isAdmin: boolean;

    @OneToMany(() => UserExerciseEntity, userExercise => userExercise.user)
    userExercise: UserExerciseEntity[];

    @OneToMany(() => WorkoutEntity, workout => workout.user)
    workout: WorkoutEntity[];
}
