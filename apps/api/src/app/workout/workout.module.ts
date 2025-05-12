import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { WorkoutEntity } from './workout.entity';
import { WorkoutService } from './workout.service';
import { WorkoutController } from './workout.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([WorkoutEntity]),
        AuthModule
    ],
    controllers: [WorkoutController],
    providers: [WorkoutService]
})
export class WorkoutModule {
}
