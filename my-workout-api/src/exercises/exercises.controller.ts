import { Body, Controller, Get, HttpCode, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ExercisesService } from './exercises.service';
import { CurrentUser } from '../auth/current-user-decorator';
import { User } from '../interfaces/user';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-auth.guard';
import { Exercise } from '../interfaces/exercise';
import { JwtAuthGuard } from '../auth/guards/JwtAuth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('exercises')
export class ExercisesController {
    constructor(
        private readonly exercisesService: ExercisesService
    ) {
    }

    @UseGuards(OptionalJwtAuthGuard)
    @Get('find-all-exercises-by-muscle-group-id')
    findAllExercisesByMuscleGroupIdAndUserId(@CurrentUser() currentUser: User, @Query('muscleGroupId') muscleGroupId: string) {
        return this.exercisesService.findAllExercisesByMuscleGroupId(Number(muscleGroupId), currentUser);
    }

    @UseGuards(JwtAuthGuard)
    @Get('find-added-exercises-by-muscle-group-id')
    @HttpCode(200)
    findAddedExercisesByMuscleGroupId(@CurrentUser() user: User, @Query('muscleGroupId') muscleGroupId: string) {
        return this.exercisesService.findAddedExercisesByMuscleGroupId(user.id, Number(muscleGroupId));
    }

    @UseGuards(JwtAuthGuard)
    @Get('find-cardio-exercises')
    findCardioExercises(@CurrentUser() user: User) {
        return this.exercisesService.findCardioExercises(user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('find-by-user-id')
    findByUserId(@CurrentUser() user: User) {
        return this.exercisesService.findByUserId(user.id);
    }

    @Get(':exerciseId')
    getExercise(@CurrentUser() currentUser: User, @Param('exerciseId') exerciseId: number) {
        return this.exercisesService.getExercise(exerciseId, currentUser);
    }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Post()
    createExercise(@Body() exercise: Exercise) {
        return this.exercisesService.createExercise(exercise);
    }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Patch(':exerciseId')
    updateExercise(@Param('exerciseId') exerciseId: number, @Body() exercise: Exercise) {
        return this.exercisesService.updateExercise(exerciseId, exercise);
    }
}

