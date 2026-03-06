package com.avernet.myworkoutapi.muscle;

import com.avernet.myworkoutapi.musclegroup.MuscleGroupEntity;
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
