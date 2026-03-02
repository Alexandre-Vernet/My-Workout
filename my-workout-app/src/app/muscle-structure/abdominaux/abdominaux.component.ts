import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';

@Component({
    selector: 'app-abdominaux',
    imports: [TableModule],
    templateUrl: './abdominaux.component.html',
    styleUrl: '../muscle-structure.component.scss',
})
export class AbdominauxComponent {}
