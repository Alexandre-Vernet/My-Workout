import { Route, RouterOutlet } from '@angular/router';
import {
    ListExercisesMuscleGroupComponent
} from './navbar/library/list-exercises-muscle-group/list-exercises-muscle-group.component';
import { ListMusclesGroupsComponent } from './navbar/library/list-muscles-groups/list-muscles-groups.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { authGuard } from './auth/auth.guard';
import {
    SelectMuscleGroupWorkoutComponent
} from './navbar/workout/select-muscle-group-workout/select-muscle-group-workout.component';
import { MenuUrls } from './shared/menu-urls';
import { WorkoutSessionComponent } from './navbar/workout/workout-session/workout-session.component';
import { ViewProfileComponent } from './navbar/view-profile/view-profile.component';
import { CalendarComponent } from './navbar/calendar/calendar.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { ViewExerciseComponent } from './navbar/library/view-exercise/view-exercise.component';
import { GraphsComponent } from './navbar/stats/graphs/graphs.component';
import { StatsComponent } from './navbar/stats/stats.component';
import { TricepsComponent } from './muscle-structure/triceps/triceps.component';
import { JambesComponent } from './muscle-structure/jambes/jambes.component';
import { PectorauxComponent } from './muscle-structure/pectoraux/pectoraux.component';
import { EpaulesComponent } from './muscle-structure/epaules/epaules.component';
import { BicepsComponent } from './muscle-structure/biceps/biceps.component';
import { AbdominauxComponent } from './muscle-structure/abdominaux/abdominaux.component';
import { DosComponent } from './muscle-structure/dos/dos.component';
import { AddExerciseComponent } from './navbar/view-profile/admin/add-exercise/add-exercise.component';
import { defaultHomePageGuard } from './auth/default-home-page.guard';
import { NotFoundComponent } from "./shared/not-found/not-found.component";


export const appRoutes: Route[] = [
    {
        path: MenuUrls.library,
        children: [
            {
                path: 'list-muscles-groups',
                component: ListMusclesGroupsComponent
            },
            {
                path: 'list-exercises-muscle-group/:muscleGroupId',
                component: ListExercisesMuscleGroupComponent
            },
            {
                path: 'exercises/:exerciseId',
                component: ViewExerciseComponent
            },
            {
                path: '**',
                redirectTo: 'list-muscles-groups'
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
        path: MenuUrls.stats,
        canActivate: [authGuard],
        children: [
            {
                path: '',
                component: StatsComponent
            },
            {
                path: 'graphs/:exerciseId',
                component: GraphsComponent
            },
            {
                path: '**',
                redirectTo: ''
            }
        ]
    },
    {
        path: MenuUrls.user,
        children: [
            {
                path: 'view-profile',
                component: ViewProfileComponent
            },
            {
                path: '**',
                redirectTo: 'view-profile'
            },
        ],
        canActivate: [authGuard]
    },
    {
        path: MenuUrls.admin,
        children: [
            {
                path: 'add-exercise',
                component: AddExerciseComponent
            },
            {
                path: 'update-exercise/:exerciseId',
                component: AddExerciseComponent
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
                path: 'login',
                component: LoginComponent
            },
            {
                path: 'register',
                component: RegisterComponent
            },
            {
                path: 'reset-password',
                component: ResetPasswordComponent
            },
            {
                path: '**',
                redirectTo: 'login'
            }
        ]
    },
    {
        path: 'not-found',
        component: NotFoundComponent
    },
    {
        path: '**',
        canActivate: [defaultHomePageGuard],
        component: RouterOutlet
    }
];
