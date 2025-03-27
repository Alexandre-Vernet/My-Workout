import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExerciseService } from '../exercise.service';
import { ActivatedRoute } from '@angular/router';
import { Exercise } from '../../../../../../libs/interfaces/exercise';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-list-exercises',
  imports: [CommonModule],
  templateUrl: './list-exercises.component.html',
  styleUrl: './list-exercises.component.scss'
})
export class ListExercisesComponent implements OnInit {

  exercises: Exercise[];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly exerciseService: ExerciseService
  ) {
  }

  ngOnInit() {
    this.route.params.pipe(
      switchMap((params: { exerciseId: number }) => this.exerciseService.listExercise(params.exerciseId))
    )
      .subscribe(exercises => {
        this.exercises = exercises;
      });
  }
}

