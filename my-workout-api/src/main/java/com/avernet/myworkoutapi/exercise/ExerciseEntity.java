package com.avernet.myworkoutapi.exercise;

import com.avernet.myworkoutapi.exercisemuscle.ExerciseMuscleEntity;
import com.avernet.myworkoutapi.history.HistoryEntity;
import com.avernet.myworkoutapi.userexercise.UserExerciseEntity;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "exercises")
@Data
public class ExerciseEntity {
    @Id
    Long id;

    @Column()
    String name;

    @Column(columnDefinition = "TEXT")
    String description;

    @Column(name = "is_smart_workout")
    Boolean isSmartWorkout;

    @OneToMany(mappedBy = "exercise", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    List<ExerciseMuscleEntity> exerciseMuscleList = new ArrayList<>();

    @OneToMany(mappedBy = "exercise", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    List<HistoryEntity> historyList = new ArrayList<>();

    @OneToMany(mappedBy = "exercise", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    List<UserExerciseEntity> userExerciseList = new ArrayList<>();
}
