package com.avernet.myworkoutapi.musclegroup;

import com.avernet.myworkoutapi.muscle.MuscleEntity;
import com.avernet.myworkoutapi.workout.WorkoutEntity;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "muscle_group")
@Data
public class MuscleGroupEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    @Enumerated(EnumType.STRING)
    @Column(name = "name")
    MuscleGroupType name;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "muscleGroup", cascade = CascadeType.ALL, orphanRemoval = true)
    List<WorkoutEntity> workoutList = new ArrayList<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "muscleGroup", cascade = CascadeType.ALL, orphanRemoval = true)
    List<MuscleEntity> muscleList = new ArrayList<>();
}
