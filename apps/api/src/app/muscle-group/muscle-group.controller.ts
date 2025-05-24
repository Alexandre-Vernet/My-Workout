import { Controller, Get, UseGuards } from '@nestjs/common';
import { MuscleGroupService } from './muscle-group.service';
import { CurrentUser } from '../auth/current-user-decorator';
import { User } from '../../../../../libs/interfaces/user';
import { AuthGuard } from '../auth/auth.guard';

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

    @UseGuards(AuthGuard)
    @Get('count-exercises')
    findAllMuscleGroupAndCountAddedExercises(@CurrentUser() user: User) {
        return this.muscleGroupService.findAllMuscleGroupAndCountAddedExercises(user.id);
    }

    @UseGuards(AuthGuard)
    @Get('suggest-muscle-group')
    suggestMuscleGroup(@CurrentUser() user: User) {
        return this.muscleGroupService.suggestMuscleGroup(user.id);
    }
}
