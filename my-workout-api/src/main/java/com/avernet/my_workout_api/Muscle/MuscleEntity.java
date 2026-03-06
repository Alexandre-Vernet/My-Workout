package com.avernet.my_workout_api.Muscle;

import com.avernet.my_workout_api.MuscleGroup.MuscleGroupEntity;
import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "muscle_group")
@Data
public class MuscleEntity {
    @Id
    Long id;

    @Column()
    String name;

    @OneToMany(fetch = FetchType.LAZY)
    List<MuscleGroupEntity> muscleGroupList = new ArrayList<>();
}
