import { Component, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Dialog } from 'primeng/dialog';
import { Subject } from 'rxjs';
import { ExerciseService } from '../../../services/exercise.service';
import { Exercise } from '../../../../../../../libs/interfaces/exercise';
import { Tag } from 'primeng/tag';

@Component({
    selector: 'app-dialog-select-cardio-exercise',
    imports: [CommonModule, Dialog, Tag],
    templateUrl: './dialog-select-cardio-exercise.component.html',
    styleUrl: './dialog-select-cardio-exercise.component.scss',
    standalone: true
})
export class DialogSelectCardioExerciseComponent implements OnInit {

    @Input() openModal: boolean;
    @Output() closeModal = new Subject<void>();

    cardioExercises: Exercise[] = [];

    constructor(
        private readonly exerciseService: ExerciseService
    ) {
    }

    ngOnInit() {
        this.exerciseService.findAllByMuscleGroupId()
            .subscribe(cardioExercises => {
                this.cardioExercises = cardioExercises;
            });
    }

    onCloseModal() {
        this.closeModal.next();
    }
}
