import { Route } from '@angular/router';
import {
    ListExercisesMuscleGroupComponent
} from './navbar/library/list-exercises-muscle-group/list-exercises-muscle-group.component';
import { ListMusclesGroupsComponent } from './navbar/library/list-muscles-groups/list-muscles-groups.component';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { authGuard } from './auth/auth.guard';
import {
    SelectMuscleGroupWorkoutComponent
} from './navbar/workout/select-muscle-group-workout/select-muscle-group-workout.component';
import { MenuUrls } from './shared/menu-urls';
import { WorkoutSessionComponent } from './navbar/workout/workout-session/workout-session.component';
import { Component } from '@angular/core';
import { ViewProfileComponent } from './navbar/view-profile/view-profile.component';
import { CalendarComponent } from './navbar/calendar/calendar.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { HistoryComponent } from './navbar/history/history.component';
import { ViewExerciseComponent } from './navbar/library/view-exercise/view-exercise.component';
import { GraphsComponent } from './navbar/view-profile/graphs/graphs.component';
import { StatsComponent } from './navbar/view-profile/stats/stats.component';
import { TricepsComponent } from './muscle-structure/triceps/triceps.component';
import { JambesComponent } from './muscle-structure/jambes/jambes.component';
import { PectorauxComponent } from './muscle-structure/pectoraux/pectoraux.component';
import { EpaulesComponent } from './muscle-structure/epaules/epaules.component';
import { BicepsComponent } from './muscle-structure/biceps/biceps.component';
import { AbdominauxComponent } from './muscle-structure/abdominaux/abdominaux.component';
import { DosComponent } from './muscle-structure/dos/dos.component';
import { PrivacyComponent } from "./shared/privacy/privacy.component";


@Component({
    selector: 'app-empty',
    template: ''
})
export class EmptyComponent {
}

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
                path: 'exercises/:exerciseId',
                component: ViewExerciseComponent
            },
            {
                path: '**',
                redirectTo: 'list-muscles-group'
            }
        ]
    },
    {
        path: MenuUrls.calendar,
        component: CalendarComponent,
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
        path: MenuUrls.history,
        component: HistoryComponent,
        canActivate: [authGuard]
    },
    {
        path: MenuUrls.user,
        children: [
            {
                path: 'view-profile',
                component: ViewProfileComponent
            },
            {
                path: 'stats',
                component: StatsComponent
            },
            {
                path: 'graphs/:exerciseId',
                component: GraphsComponent
            },
            {
                path: '**',
                redirectTo: 'view-profile'
            },
        ],
        canActivate: [authGuard]
    },
    {
        path: MenuUrls.muscleStructure,
        children: [
            {
                path: 'pectoraux',
                component: PectorauxComponent
            },
            {
                path: 'triceps',
                component: TricepsComponent
            },
            {
                path: 'jambes',
                component: JambesComponent
            },
            {
                path: 'epaules',
                component: EpaulesComponent
            },
            {
                path: 'dos',
                component: DosComponent
            },
            {
                path: 'biceps',
                component: BicepsComponent
            },
            {
                path: 'abdominaux',
                component: AbdominauxComponent
            }
        ]
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
            },
            {
                path: 'reset-password',
                component: ResetPasswordComponent
            },
            {
                path: '**',
                redirectTo: 'sign-in'
            }
        ]
    },
    {
        path: 'privacy',
        component: PrivacyComponent
    },
    {
        path: '**',
        redirectTo: MenuUrls.library
    }
];
