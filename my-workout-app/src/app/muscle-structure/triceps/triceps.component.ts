import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';

@Component({
    selector: 'app-triceps',
    imports: [TableModule],
    templateUrl: './triceps.component.html',
    styleUrl: '../muscle-structure.component.scss',
    standalone: true
})
export class TricepsComponent {}
