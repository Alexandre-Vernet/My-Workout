package com.avernet.myworkoutapi.workout;

import com.avernet.myworkoutapi.musclegroup.MuscleGroupEntity;
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
