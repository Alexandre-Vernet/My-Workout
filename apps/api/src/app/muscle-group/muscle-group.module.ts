import { Module } from '@nestjs/common';
import { MuscleGroupService } from './muscle-group.service';
import { MuscleGroupController } from './muscle-group.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MuscleGroupEntity } from './muscle-group.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([MuscleGroupEntity])
  ],
  controllers: [MuscleGroupController],
  providers: [MuscleGroupService],
    exports: [MuscleGroupService]
})
export class MuscleGroupModule {}
