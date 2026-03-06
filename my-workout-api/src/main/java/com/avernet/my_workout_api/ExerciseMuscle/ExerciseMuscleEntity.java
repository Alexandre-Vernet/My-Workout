package com.avernet.my_workout_api.ExerciseMuscle;

import com.avernet.my_workout_api.Muscle.MuscleEntity;
import com.avernet.my_workout_api.exercise.ExerciseEntity;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "muscle_group")
@Data
public class ExerciseMuscleEntity {
    @Id
    Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    ExerciseEntity exercise;

    @ManyToOne(fetch = FetchType.LAZY)
    MuscleEntity muscle;
}
