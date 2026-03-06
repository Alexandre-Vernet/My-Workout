package com.avernet.myworkoutapi.history;

import com.avernet.myworkoutapi.workout.WorkoutEntity;
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
