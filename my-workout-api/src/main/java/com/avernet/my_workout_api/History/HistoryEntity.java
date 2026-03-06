package com.avernet.my_workout_api.History;

import com.avernet.my_workout_api.Workout.WorkoutEntity;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "muscle_group")
@Data
public class HistoryEntity {
    @Id
    Long id;

    @Column()
    Float weight;

    @Column()
    Short reps;

    @ManyToOne(fetch = FetchType.LAZY)
    WorkoutEntity workout;
}
