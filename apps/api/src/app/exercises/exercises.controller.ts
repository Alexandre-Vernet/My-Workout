import { Controller, Get, HttpCode, Param, Query, UseGuards } from '@nestjs/common';
import { ExercisesService } from './exercises.service';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user-decorator';
import { User } from '../../../../../libs/interfaces/user';
import { OptionalCurrentUser } from '../auth/optional-current-user-decorator';

@Controller('exercises')
export class ExercisesController {
    constructor(
        private readonly exercisesService: ExercisesService
    ) {
    }

    @Get('find-all-exercises-by-muscle-group-id')
    findAllExercisesByMuscleGroupIdAndUserId(@OptionalCurrentUser() optionalCurrentUser: User, @Query('muscleGroupId') muscleGroupId: string) {
        return this.exercisesService.findAllExercisesByMuscleGroupId(Number(muscleGroupId), optionalCurrentUser);
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

    @Get(':exerciseId')
    getExercise(@Param('exerciseId') exerciseId: number) {
        return this.exercisesService.getExercise(exerciseId);
    }
}
