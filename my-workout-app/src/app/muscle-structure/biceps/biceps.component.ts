import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';

@Component({
    selector: 'app-biceps',
    imports: [TableModule],
    templateUrl: './biceps.component.html',
    styleUrl: '../muscle-structure.component.scss',
})
export class BicepsComponent {}
