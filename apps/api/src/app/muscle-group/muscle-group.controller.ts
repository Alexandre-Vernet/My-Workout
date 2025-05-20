import { Controller, Get, Req } from '@nestjs/common';
import { MuscleGroupService } from './muscle-group.service';
import { AuthService } from '../auth/auth.service';

@Controller('muscle-group')
export class MuscleGroupController {

    constructor(
        private readonly muscleGroupService: MuscleGroupService,
        private readonly authService: AuthService
    ) {
    }

    @Get()
    findAll() {
        return this.muscleGroupService.findAll();
    }

    @Get('count-exercises')
    findAllMuscleGroupAndCountAddedExercises(@Req() request: Request) {
        const token = request.headers['authorization'].split(' ')[1];
        const user = this.authService.verifyToken(token);
        return this.muscleGroupService.findAllMuscleGroupAndCountAddedExercises(user.id);
    }

    @Get('suggest-muscle-group')
    suggestMuscleGroup(@Req() request: Request) {
        const token = request.headers['authorization'].split(' ')[1];
        const user = this.authService.verifyToken(token);
        return this.muscleGroupService.suggestMuscleGroup(user.id);
    }
}
