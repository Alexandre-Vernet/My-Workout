import { Module } from '@nestjs/common';
import { ExercisesService } from './exercises.service';
import { ExercisesController } from './exercises.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExercisesEntity } from './exercises.entity';
import { MuscleGroupModule } from '../muscle-group/muscle-group.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([ExercisesEntity]),
        MuscleGroupModule
    ],
    controllers: [ExercisesController],
    providers: [ExercisesService]
})
export class ExercisesModule {
}
