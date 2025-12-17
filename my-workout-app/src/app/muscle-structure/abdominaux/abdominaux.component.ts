import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { IonContent } from "@ionic/angular/standalone";

@Component({
    selector: 'app-abdominaux',
    imports: [CommonModule, TableModule, IonContent],
    templateUrl: './abdominaux.component.html',
    styleUrl: '../muscle-structure.component.scss',
})
export class AbdominauxComponent {}
