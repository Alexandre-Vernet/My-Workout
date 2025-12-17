import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { IonContent } from "@ionic/angular/standalone";

@Component({
    selector: 'app-triceps',
    imports: [CommonModule, TableModule, IonContent],
    templateUrl: './triceps.component.html',
    styleUrl: '../muscle-structure.component.scss',
    standalone: true
})
export class TricepsComponent {}
