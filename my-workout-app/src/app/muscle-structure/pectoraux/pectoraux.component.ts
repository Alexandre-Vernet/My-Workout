import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeTemplate } from 'primeng/api';
import { TableModule } from 'primeng/table';

@Component({
    selector: 'app-legs',
    imports: [CommonModule, PrimeTemplate, TableModule],
    templateUrl: './pectoraux.component.html',
    styleUrl: '../muscle-structure.component.scss',
})
export class PectorauxComponent {}
