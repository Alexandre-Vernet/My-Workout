import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { MuscleGroupEntity } from '../muscle-group/muscle-group.entity';
import { HistoryEntity } from '../history/history.entity';

@Entity({ name: 'workout', schema: 'public' })
export class WorkoutEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(() => UserEntity, user => user.workout, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;

    @ManyToOne(() => MuscleGroupEntity, muscleGroup => muscleGroup.workout, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'muscle_group_id' })
    muscleGroup: MuscleGroupEntity;

    @Column({ type: 'timestamp' })
    date: Date;

    @Column()
    duration: number;

    @OneToMany(() => HistoryEntity, history => history.workout)
    history: HistoryEntity[];
}
