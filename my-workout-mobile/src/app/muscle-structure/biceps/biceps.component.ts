import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';

@Component({
    selector: 'app-biceps',
    imports: [CommonModule, TableModule],
    templateUrl: './biceps.component.html',
    styleUrl: '../muscle-structure.component.scss',
})
export class BicepsComponent {}
