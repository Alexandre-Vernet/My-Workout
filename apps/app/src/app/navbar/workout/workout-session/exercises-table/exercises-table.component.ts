import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { Exercise } from '../../../../../../../../libs/interfaces/exercise';

@Component({
    selector: 'app-exercises-table',
    imports: [CommonModule, TableModule],
    templateUrl: './exercises-table.component.html',
    styleUrl: './exercises-table.component.scss',
})
export class ExercisesTableComponent {
    @Input() exercisesMade: Exercise[] = [];
}
