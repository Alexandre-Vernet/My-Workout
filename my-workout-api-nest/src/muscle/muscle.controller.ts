import { Controller, Get } from '@nestjs/common';
import { MuscleService } from './muscle.service';

@Controller('muscle')
export class MuscleController {

    constructor(
        private readonly muscleService: MuscleService
    ) {
    }

    @Get()
    findAllMuscle() {
        return this.muscleService.findAllMuscle();
    }

}
