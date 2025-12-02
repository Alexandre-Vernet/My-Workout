import { Controller, Get, HttpCode, Param, Query, UseGuards } from '@nestjs/common';
import { ExercisesService } from './exercises.service';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user-decorator';
import { User } from '../interfaces/user';
import { OptionalAuthGuard } from "../auth/optional-auth.guard";

@Controller('exercises')
export class ExercisesController {
    constructor(
        private readonly exercisesService: ExercisesService
    ) {
    }

    @UseGuards(OptionalAuthGuard)
    @Get('find-all-exercises-by-muscle-group-id')
    findAllExercisesByMuscleGroupIdAndUserId(@CurrentUser() currentUser: User, @Query('muscleGroupId') muscleGroupId: string) {
        return this.exercisesService.findAllExercisesByMuscleGroupId(Number(muscleGroupId), currentUser);
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

    @UseGuards(AuthGuard)
    @Get('find-by-user-id')
    findByUserId(@CurrentUser() user: User) {
        return this.exercisesService.findByUserId(user.id);
    }

    @Get(':exerciseId')
    getExercise(@CurrentUser() currentUser: User, @Param('exerciseId') exerciseId: number) {
        return this.exercisesService.getExercise(exerciseId, currentUser);
    }
}
