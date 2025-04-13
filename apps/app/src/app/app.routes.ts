import { Route } from '@angular/router';
import { ListExercisesComponent } from './exercise/list-exercises/list-exercises.component';
import { ListMuscleGroupComponent } from './muscle-group/list-muscle-group/list-muscle-group.component';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { authGuard } from './auth/auth.guard';

export const appRoutes: Route[] = [
    {
        path: '',
        component: ListMuscleGroupComponent,
        canActivate: [authGuard]
    },
    {
        path: 'exercise/:exerciseId',
        component: ListExercisesComponent,
        canActivate: [authGuard]
    },
    {
        path: 'auth',
        children: [
            {
                path: 'sign-in',
                component: SignInComponent
            },
            {
                path: 'sign-up',
                component: SignUpComponent
            }
        ]
    }
];
