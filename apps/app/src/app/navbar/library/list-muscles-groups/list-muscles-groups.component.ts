import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MuscleGroupService } from '../../../services/muscle-group.service';
import { MuscleGroup } from '../../../../../../../libs/interfaces/MuscleGroup';
import { RouterLink } from '@angular/router';
import { Message } from 'primeng/message';

@Component({
    selector: 'app-list-muscle-group',
    imports: [CommonModule, RouterLink, Message],
    templateUrl: './list-muscles-groups.component.html',
    styleUrl: './list-muscles-groups.component.scss',
    standalone: true
})
export class ListMusclesGroupsComponent implements OnInit {

    muscleGroups: MuscleGroup[];

    errorMessage: string;


    constructor(private readonly muscleGroupService: MuscleGroupService) {
    }

    ngOnInit() {
        this.muscleGroupService.findAllMuscleGroup()
            .subscribe({
                next: (muscleGroups) => {
                    this.muscleGroups = muscleGroups;
                    this.errorMessage = '';
                },
                error: (err) => this.errorMessage = err?.error?.message ?? 'Impossible d\'afficher la bibliothèque d\'exercices'
            });
    }
}
