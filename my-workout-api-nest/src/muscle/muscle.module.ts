import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MuscleEntity } from './muscle.entity';
import { MuscleController } from './muscle.controller';
import { MuscleService } from './muscle.service';

@Module({
    imports: [TypeOrmModule.forFeature([MuscleEntity])],
    controllers: [MuscleController],
    providers: [MuscleService],
    exports: [MuscleService]
})
export class MuscleModule {

}
