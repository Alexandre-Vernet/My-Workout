package com.avernet.myworkoutapi.exercise;

import com.avernet.myworkoutapi.exercisemuscle.ExerciseMuscleEntity;
import com.avernet.myworkoutapi.history.HistoryEntity;
import com.avernet.myworkoutapi.userexercise.UserExerciseEntity;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "exercises")
@Getter
@Setter
public class ExerciseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column()
    String name;

    @Column(columnDefinition = "TEXT")
    String description;

    @Column(name = "is_smart_workout")
    boolean isSmartWorkout;

    @OneToMany(mappedBy = "exercise", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    List<ExerciseMuscleEntity> exerciseMuscles = new ArrayList<>();

    @OneToMany(mappedBy = "exercise", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    List<HistoryEntity> histories = new ArrayList<>();

    @OneToMany(mappedBy = "exercise", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    List<UserExerciseEntity> userExercises = new ArrayList<>();
}
