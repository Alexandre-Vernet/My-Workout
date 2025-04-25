import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Splitter } from 'primeng/splitter';
import { MuscleGroup } from '../../../../../../../libs/interfaces/MuscleGroup';
import { MuscleGroupService } from '../../../services/muscle-group.service';
import { RouterLink } from '@angular/router';
import { MenuUrls } from '../../../shared/menu-urls';
import { take } from 'rxjs';
import { Message } from 'primeng/message';

@Component({
    selector: 'select-muscle-group-workout',
    imports: [CommonModule, Splitter, RouterLink, Message],
    templateUrl: './select-muscle-group-workout.component.html',
    styleUrl: './select-muscle-group-workout.component.scss',
    standalone: true
})
export class SelectMuscleGroupWorkoutComponent implements OnInit {

    protected readonly MenuUrls = MenuUrls;

    muscleGroups: MuscleGroup[] = [];

    errorMessage: string;

    constructor(private readonly muscleGroupService: MuscleGroupService) {
    }

    ngOnInit() {
        this.muscleGroupService.findAllMuscleGroup()
            .pipe(take(1))
            .subscribe({
                next: (muscleGroups) => {
                    this.muscleGroups = muscleGroups;
                    this.errorMessage = '';
                },
                error: (err) => this.errorMessage = err?.error?.message ?? 'Impossible d\'afficher les entraînements'
            });
    }
}
