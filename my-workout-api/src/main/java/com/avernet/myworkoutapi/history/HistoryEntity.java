package com.avernet.myworkoutapi.history;

import com.avernet.myworkoutapi.exercise.ExerciseEntity;
import com.avernet.myworkoutapi.workout.WorkoutEntity;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "history")
@Data
public class HistoryEntity {
    @Id
    Long id;

    @Column()
    Float weight;

    @Column()
    Short reps;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workout_id")
    WorkoutEntity workout;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exercise_id")
    ExerciseEntity exercise;
}
