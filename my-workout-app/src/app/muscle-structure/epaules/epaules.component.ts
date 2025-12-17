import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { IonContent } from "@ionic/angular/standalone";

@Component({
    selector: 'app-epaules',
    imports: [CommonModule, TableModule, IonContent],
    templateUrl: './epaules.component.html',
    styleUrl: '../muscle-structure.component.scss',
})
export class EpaulesComponent {}
