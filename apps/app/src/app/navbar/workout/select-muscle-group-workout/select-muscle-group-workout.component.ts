import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Splitter } from 'primeng/splitter';
import { MuscleGroup } from '../../../../../../../libs/interfaces/MuscleGroup';
import { MuscleGroupService } from '../../../services/muscle-group.service';
import { RouterLink } from '@angular/router';
import { MenuUrls } from '../../../shared/menu-urls';
import { take } from 'rxjs';

@Component({
    selector: 'select-muscle-group-workout',
    imports: [CommonModule, Splitter, RouterLink],
    templateUrl: './select-muscle-group-workout.component.html',
    styleUrl: './select-muscle-group-workout.component.scss',
    standalone: true
})
export class SelectMuscleGroupWorkoutComponent implements OnInit {

    protected readonly MenuUrls = MenuUrls;

    muscleGroups: MuscleGroup[] = [];

    constructor(private readonly muscleGroupService: MuscleGroupService) {
    }

    ngOnInit() {
        this.muscleGroupService.findAllMuscleGroup()
            .pipe(take(1))
            .subscribe((muscleGroups) => this.muscleGroups = muscleGroups);
    }
}
