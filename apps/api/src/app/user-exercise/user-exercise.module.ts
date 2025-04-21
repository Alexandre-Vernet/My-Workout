import { Module } from '@nestjs/common';
import { UserExerciseService } from './user-exercise.service';
import { UserExerciseController } from './user-exercise.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserExerciseEntity } from './user-exercise.entity';

@Module({
    imports: [TypeOrmModule.forFeature([UserExerciseEntity])],
    controllers: [UserExerciseController],
    providers: [UserExerciseService]
})
export class UserExerciseModule {
}
