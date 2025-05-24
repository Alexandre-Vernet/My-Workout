import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MuscleGroupService } from '../../../services/muscle-group.service';
import { MuscleGroup } from '../../../../../../../libs/interfaces/MuscleGroup';
import { RouterLink } from '@angular/router';
import { Skeleton } from 'primeng/skeleton';
import { AlertService } from '../../../services/alert.service';

@Component({
    selector: 'app-list-muscle-group',
    imports: [CommonModule, RouterLink, Skeleton],
    templateUrl: './list-muscles-groups.component.html',
    styleUrl: './list-muscles-groups.component.scss',
    standalone: true
})
export class ListMusclesGroupsComponent implements OnInit {

    muscleGroups: MuscleGroup[];

    isLoading = true;


    constructor(
        private readonly muscleGroupService: MuscleGroupService,
        private readonly alertService: AlertService
    ) {
    }

    ngOnInit() {
        this.muscleGroupService.findAllMuscleGroup()
            .subscribe({
                next: (muscleGroups) => {
                    this.isLoading = false;
                    this.muscleGroups = muscleGroups;
                    this.alertService.alert$.next(null);
                },
                error: (err) => {
                    this.alertService.alert$.next({
                        severity: 'error',
                        message: err?.error?.message ?? 'Impossible d\'afficher la bibliothèque d\'exercices'
                    });
                }
            });
    }
}
