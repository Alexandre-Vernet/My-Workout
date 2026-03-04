import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';

@Component({
    selector: 'app-epaules',
    imports: [TableModule],
    templateUrl: './epaules.component.html',
    styleUrl: '../muscle-structure.component.scss',
})
export class EpaulesComponent {}
