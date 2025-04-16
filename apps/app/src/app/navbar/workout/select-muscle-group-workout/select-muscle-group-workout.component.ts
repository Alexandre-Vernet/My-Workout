import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Splitter } from 'primeng/splitter';
import { MuscleGroup } from '../../../../../../../libs/interfaces/MuscleGroup';
import { MuscleGroupService } from '../../../muscle-group/muscle-group.service';

@Component({
    selector: 'select-muscle-group-workout',
    imports: [CommonModule, Splitter],
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
                next: muscleGroups => {
                    console.log(muscleGroups);
                    return this.muscleGroups = muscleGroups;
                }
            });
    }

    selectMuscleGroup(musclegroup: MuscleGroup) {
        console.log(musclegroup);
    }
}
