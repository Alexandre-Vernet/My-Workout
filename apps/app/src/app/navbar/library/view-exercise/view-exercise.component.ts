import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { switchMap, take } from 'rxjs';
import { ExerciseService } from '../../../services/exercise.service';

@Component({
    selector: 'app-view-exercise',
    imports: [CommonModule],
    templateUrl: './view-exercise.component.html',
    styleUrl: './view-exercise.component.scss',
    standalone: true
})
export class ViewExerciseComponent implements OnInit {

    constructor(
        private readonly exerciseService: ExerciseService,
        private readonly activatedRoute: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.activatedRoute.params.pipe(
            take(1),
            switchMap((params: {
                exerciseId: number
            }) => this.exerciseService.getExercise(Number(params.exerciseId)))
        )
            .subscribe();
    }
}
