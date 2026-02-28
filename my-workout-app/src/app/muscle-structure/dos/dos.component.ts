import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';

@Component({
    selector: 'app-dos',
    imports: [CommonModule, TableModule],
    templateUrl: './dos.component.html',
    styleUrl: '../muscle-structure.component.scss',
})
export class DosComponent {}
