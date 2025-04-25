import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserExerciseEntity } from '../user-exercise/user-exercise.entity';

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

    @Column({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;

    @OneToMany(() => UserExerciseEntity, userExercise => userExercise.id, { onDelete: 'CASCADE' })
    userExercise: UserExerciseEntity[];
}
