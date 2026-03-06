package com.avernet.my_workout_api.Workout;

import com.avernet.my_workout_api.MuscleGroup.MuscleGroupEntity;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Table(name = "muscle_group")
@Data
public class WorkoutEntity {
    @Id
    Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    MuscleGroupEntity muscleGroup;

    @Column()
    LocalDate date;

    @Column()
    Integer duration;
}
