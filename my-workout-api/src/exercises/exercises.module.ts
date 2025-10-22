import { Module } from '@nestjs/common';
import { ExercisesService } from './exercises.service';
import { ExercisesController } from './exercises.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExercisesEntity } from './exercises.entity';
import { MuscleGroupModule } from '../muscle-group/muscle-group.module';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([ExercisesEntity]),
        MuscleGroupModule,
        AuthModule
    ],
    controllers: [ExercisesController],
    providers: [ExercisesService],
    exports: [ExercisesService]
})
export class ExercisesModule {
}
