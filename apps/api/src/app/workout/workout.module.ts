import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { WorkoutEntity } from './workout.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([WorkoutEntity]),
        // AuthModule
    ],
    // controllers: [UserExerciseController],
    // providers: [UserExerciseService]
})
export class WorkoutModule {
}
