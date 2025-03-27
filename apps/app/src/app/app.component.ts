import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListMuscleGroupComponent } from './muscle-group/list-muscle-group/list-muscle-group.component';
import { ListExercisesComponent } from './exercise/list-exercises/list-exercises.component';

@Component({
  imports: [RouterModule, ListMuscleGroupComponent, ListExercisesComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
