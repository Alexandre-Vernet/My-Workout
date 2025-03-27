import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExerciseService } from '../exercise.service';

@Component({
  selector: 'app-list-exercises',
  imports: [CommonModule],
  templateUrl: './list-exercises.component.html',
  styleUrl: './list-exercises.component.scss',
})
export class ListExercisesComponent implements OnInit {
  constructor(private readonly exerciseService: ExerciseService) {}

  ngOnInit() {
    this.exerciseService.listExercise(1).subscribe();
  }
}

