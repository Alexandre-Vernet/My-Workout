import { Module } from '@nestjs/common';
import { UserExerciseService } from './user-exercise.service';
import { UserExerciseController } from './user-exercise.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserExerciseEntity } from './user-exercise.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserExerciseEntity]),
        AuthModule
    ],
    controllers: [UserExerciseController],
    providers: [UserExerciseService]
})
export class UserExerciseModule {
}
