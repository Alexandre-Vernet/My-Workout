import { Component } from '@angular/core';
import { PrimeTemplate } from 'primeng/api';
import { TableModule } from 'primeng/table';

@Component({
    selector: 'app-legs',
    imports: [PrimeTemplate, TableModule],
    templateUrl: './pectoraux.component.html',
    styleUrl: '../muscle-structure.component.scss',
})
export class PectorauxComponent {}
