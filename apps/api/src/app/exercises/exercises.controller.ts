import { Controller, Get, HttpCode, Query, UseGuards } from '@nestjs/common';
import { ExercisesService } from './exercises.service';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user-decorator';
import { User } from '../../../../../libs/interfaces/user';

@Controller('exercises')
@UseGuards(AuthGuard)
export class ExercisesController {
    constructor(
        private readonly exercisesService: ExercisesService
    ) {
    }

    @Get('find-all-exercises-by-muscle-group-id')
    findAllExercisesByMuscleGroupIdAndUserId(@CurrentUser() user: User, @Query('muscleGroupId') muscleGroupId: string) {
        return this.exercisesService.findAllExercisesByMuscleGroupId(Number(muscleGroupId), user);
    }


    @UseGuards(AuthGuard)
    @Get('find-added-exercises-by-muscle-group-id')
    @HttpCode(200)
    findAddedExercisesByMuscleGroupId(@CurrentUser() user: User, @Query('muscleGroupId') muscleGroupId: string) {
        return this.exercisesService.findAddedExercisesByMuscleGroupId(user.id, Number(muscleGroupId));
    }

    @UseGuards(AuthGuard)
    @Get('find-cardio-exercises')
    findCardioExercises(@CurrentUser() user: User) {
        return this.exercisesService.findCardioExercises(user.id);
    }
}
