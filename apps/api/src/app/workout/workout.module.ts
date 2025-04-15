import { Module } from '@nestjs/common';
import { WorkoutService } from './workout.service';
import { WorkoutController } from './workout.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkoutEntity } from './workout.entity';

@Module({
    imports: [TypeOrmModule.forFeature([WorkoutEntity])],
    controllers: [WorkoutController],
    providers: [WorkoutService]
})
export class WorkoutModule {
}
