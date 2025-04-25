import { Route } from '@angular/router';
import { ListExercisesMuscleGroupComponent } from './navbar/library/list-exercises-muscle-group/list-exercises-muscle-group.component';
import {
    ListMusclesGroupsComponent
} from './navbar/library/list-muscles-groups/list-muscles-groups.component';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { authGuard } from './auth/auth.guard';
import {
    SelectMuscleGroupWorkoutComponent
} from './navbar/workout/select-muscle-group-workout/select-muscle-group-workout.component';
import { MenuUrls } from './shared/menu-urls';
import { WorkoutSessionComponent } from './navbar/workout/workout-session/workout-session.component';

export const appRoutes: Route[] = [
    {
        path: MenuUrls.library,
        children: [
            {
                path: 'list-muscles-group',
                component: ListMusclesGroupsComponent
            },
            {
                path: 'muscle-group/:muscleGroupId',
                component: ListExercisesMuscleGroupComponent
            },
            {
                path: '**',
                redirectTo: 'list-muscles-group'
            }
        ],
        canActivate: [authGuard]
    },

    {
        path: MenuUrls.workout,
        children: [
            {
                path: 'select-muscle-group-workout',
                component: SelectMuscleGroupWorkoutComponent
            },
            {
                path: 'workout-session/:muscleGroupId',
                component: WorkoutSessionComponent
            },
            {
                path: '**',
                redirectTo: 'select-muscle-group-workout'
            }
        ],
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
        redirectTo: MenuUrls.workout,
        pathMatch: 'full'
    }
];
