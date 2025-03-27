import { Route } from '@angular/router';
import { ListExercisesComponent } from './exercise/list-exercises/list-exercises.component';
import { ListMuscleGroupComponent } from './muscle-group/list-muscle-group/list-muscle-group.component';

export const appRoutes: Route[] = [
  {
    path: '',
    component: ListMuscleGroupComponent
  },
  {
    path: 'exercise/:exerciseId',
    component: ListExercisesComponent
  }
];
