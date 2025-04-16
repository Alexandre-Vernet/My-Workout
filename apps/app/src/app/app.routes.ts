import { Route } from '@angular/router';
import { ListExercisesComponent } from './exercise/list-exercises/list-exercises.component';
import {
    ListMuscleGroupLibraryComponent
} from './navbar/librairy/list-muscle-group-library/list-muscle-group-library.component';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { authGuard } from './auth/auth.guard';
import {
    SelectMuscleGroupWorkoutComponent
} from './navbar/workout/select-muscle-group-workout/select-muscle-group-workout.component';
import { MenuUrls } from './shared/menu-urls';

export const appRoutes: Route[] = [
    {
        path: MenuUrls.library,
        component: ListMuscleGroupLibraryComponent,
        canActivate: [authGuard]
    },
    {
        path: MenuUrls.workout,
        children: [
            {
                path: '**',
                redirectTo: 'select-muscle-group-workout'
            },
            {
                path: 'select-muscle-group-workout',
                component: SelectMuscleGroupWorkoutComponent

            }
        ],
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
    },
    {
        path: '**',
        redirectTo: '/workout',
        pathMatch: 'full'
    }
];
