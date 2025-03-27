import { Module } from '@nestjs/common';
import { ExercisesService } from './exercises.service';
import { ExercisesController } from './exercises.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExercisesEntity } from './exercises.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExercisesEntity])],
  controllers: [ExercisesController],
  providers: [ExercisesService],
})
export class ExercisesModule {}
