import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExercisesEntity } from './exercises/exercises.entity';
import { MuscleEntity } from './muscle.entity';
import { ExerciseMuscleEntity } from './exerciseMuscle.entity';
import { MuscleGroupEntity } from './muscle-group/muscle-group.entity';
import { MuscleGroupModule } from './muscle-group/muscle-group.module';
import { ExercisesModule } from './exercises/exercises.module';

const {
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_USERNAME,
  POSTGRES_PASSWORD,
  POSTGRES_DATABASE,
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
      ],
      ssl: false,
    }),
    MuscleGroupModule,
    ExercisesModule,
  ],
})
export class AppModule {}
