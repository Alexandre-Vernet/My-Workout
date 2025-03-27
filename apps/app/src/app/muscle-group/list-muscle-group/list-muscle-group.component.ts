import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MuscleGroupService } from '../muscle-group.service';

@Component({
  selector: 'app-list-muscle-group',
  imports: [CommonModule],
  templateUrl: './list-muscle-group.component.html',
  styleUrl: './list-muscle-group.component.scss',
  standalone: true,
})
export class ListMuscleGroupComponent implements OnInit {
  constructor(private readonly muscleGroupService: MuscleGroupService) {}

  ngOnInit() {
    this.muscleGroupService.findAllMuscleGroup().subscribe();
  }
}
