package com.avernet.myworkoutapi.exercisemuscle;

import com.avernet.myworkoutapi.muscle.MuscleEntity;
import com.avernet.myworkoutapi.exercise.ExerciseEntity;
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
