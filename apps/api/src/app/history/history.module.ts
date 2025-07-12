import { Module } from '@nestjs/common';
import { HistoryService } from './history.service';
import { HistoryController } from './history.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoryEntity } from './history.entity';
import { AuthModule } from '../auth/auth.module';
import { WorkoutModule } from '../workout/workout.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([HistoryEntity]),
        AuthModule,
        WorkoutModule
    ],
    controllers: [HistoryController],
    providers: [HistoryService],
})
export class HistoryModule {}
