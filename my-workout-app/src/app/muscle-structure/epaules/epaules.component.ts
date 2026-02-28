import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';

@Component({
    selector: 'app-epaules',
    imports: [CommonModule, TableModule],
    templateUrl: './epaules.component.html',
    styleUrl: '../muscle-structure.component.scss',
})
export class EpaulesComponent {}
