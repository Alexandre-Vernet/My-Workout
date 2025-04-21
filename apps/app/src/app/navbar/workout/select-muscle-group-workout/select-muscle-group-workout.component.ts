import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Splitter } from 'primeng/splitter';
import { MuscleGroup } from '../../../../../../../libs/interfaces/MuscleGroup';
import { MuscleGroupService } from '../../../services/muscle-group.service';
import { RouterLink } from '@angular/router';
import { MenuUrls } from '../../../shared/menu-urls';

@Component({
    selector: 'select-muscle-group-workout',
    imports: [CommonModule, Splitter, RouterLink],
    templateUrl: './select-muscle-group-workout.component.html',
    styleUrl: './select-muscle-group-workout.component.scss',
    standalone: true
})
export class SelectMuscleGroupWorkoutComponent implements OnInit {
    muscleGroups: MuscleGroup[] = [];

    constructor(private readonly muscleGroupService: MuscleGroupService) {
    }

    ngOnInit() {
        this.muscleGroupService.findAllMuscleGroup()
            .subscribe({
                next: muscleGroups => this.muscleGroups = muscleGroups
            });
    }

    selectMuscleGroup(musclegroup: MuscleGroup) {
        console.log(musclegroup);
    }

    protected readonly MenuUrls = MenuUrls;
}
