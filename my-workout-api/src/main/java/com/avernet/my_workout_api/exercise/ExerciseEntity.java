package com.avernet.my_workout_api.exercise;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "exercises")
@Data
public class ExerciseEntity {
    @Id
    Long id;

    @Column()
    String name;

    @Column()
    String description;

    @Column(name = "is_smart_workout")
    Boolean isSmartWorkout;
}
