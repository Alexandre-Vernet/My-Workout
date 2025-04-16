import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MuscleGroupService } from '../../../muscle-group/muscle-group.service';
import { MuscleGroup } from '../../../../../../../libs/interfaces/MuscleGroup';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-list-muscle-group',
    imports: [CommonModule, RouterLink],
    templateUrl: './list-muscle-group-library.component.html',
    styleUrl: './list-muscle-group-library.component.scss',
    standalone: true
})
export class ListMuscleGroupLibraryComponent implements OnInit {

    muscleGroups: MuscleGroup[];

    constructor(private readonly muscleGroupService: MuscleGroupService) {
    }

    ngOnInit() {
        this.muscleGroupService.findAllMuscleGroup()
            .subscribe({
                next: muscleGroups => this.muscleGroups = muscleGroups
            });
    }
}
