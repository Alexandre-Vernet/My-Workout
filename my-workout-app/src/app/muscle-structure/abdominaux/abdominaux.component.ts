import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';

@Component({
    selector: 'app-abdominaux',
    imports: [CommonModule, TableModule],
    templateUrl: './abdominaux.component.html',
    styleUrl: '../muscle-structure.component.scss',
})
export class AbdominauxComponent {}
