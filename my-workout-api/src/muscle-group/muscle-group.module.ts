import { Module } from '@nestjs/common';
import { MuscleGroupService } from './muscle-group.service';
import { MuscleGroupController } from './muscle-group.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MuscleGroupEntity } from './muscle-group.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MuscleGroupEntity]),
      AuthModule
  ],
  controllers: [MuscleGroupController],
  providers: [MuscleGroupService],
    exports: [MuscleGroupService]
})
export class MuscleGroupModule {}
