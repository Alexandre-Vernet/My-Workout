import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExercisesEntity } from './exercises/exercises.entity';
import { MuscleEntity } from './muscle/muscle.entity';
import { ExerciseMuscleEntity } from './exercise-muscle/exercise-muscle.entity';
import { MuscleGroupEntity } from './muscle-group/muscle-group.entity';
import { MuscleGroupModule } from './muscle-group/muscle-group.module';
import { ExercisesModule } from './exercises/exercises.module';
import { UserEntity } from './user/user.entity';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { UserExerciseModule } from './user-exercise/user-exercise.module';
import { UserExerciseEntity } from './user-exercise/user-exercise.entity';
import { HistoryModule } from './history/history.module';
import { HistoryEntity } from './history/history.entity';

const {
    POSTGRES_HOST,
    POSTGRES_PORT,
    POSTGRES_USERNAME,
    POSTGRES_PASSWORD,
    POSTGRES_DATABASE,
    JWT_SECRET,
} = process.env;

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: POSTGRES_HOST,
            port: Number(POSTGRES_PORT),
            username: POSTGRES_USERNAME,
            password: POSTGRES_PASSWORD,
            database: POSTGRES_DATABASE,
            entities: [
                ExercisesEntity,
                MuscleEntity,
                ExerciseMuscleEntity,
                MuscleGroupEntity,
                UserEntity,
                UserExerciseEntity,
                HistoryEntity
            ],
            ssl: false,
        }),
        JwtModule.register({
            global: true,
            secret: JWT_SECRET,
            signOptions: { expiresIn: '1d' },
        }),
        MuscleGroupModule,
        ExercisesModule,
        AuthModule,
        UserExerciseModule,
        HistoryModule,
    ],
})
export class AppModule {}
