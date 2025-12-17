import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeTemplate } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { IonContent } from "@ionic/angular/standalone";

@Component({
    selector: 'app-legs',
    imports: [CommonModule, PrimeTemplate, TableModule, IonContent],
    templateUrl: './pectoraux.component.html',
    styleUrl: '../muscle-structure.component.scss',
})
export class PectorauxComponent {}
