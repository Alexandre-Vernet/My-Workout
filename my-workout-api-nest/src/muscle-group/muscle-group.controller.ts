import { Controller, Get, UseGuards } from '@nestjs/common';
import { MuscleGroupService } from './muscle-group.service';
import { CurrentUser } from '../auth/current-user-decorator';
import { JwtAuthGuard } from '../auth/guards/JwtAuth.guard';
import { User } from '../interfaces/user';

@Controller('muscle-group')
export class MuscleGroupController {

    constructor(
        private readonly muscleGroupService: MuscleGroupService
    ) {
    }

    @Get()
    findAll() {
        return this.muscleGroupService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Get('count-exercises')
    findAllMuscleGroupAndCountAddedExercises(@CurrentUser() user: User) {
        return this.muscleGroupService.findAllMuscleGroupAndCountAddedExercises(user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('suggest-muscle-group')
    suggestMuscleGroup(@CurrentUser() user: User) {
        return this.muscleGroupService.suggestMuscleGroup(user.id);
    }
}
