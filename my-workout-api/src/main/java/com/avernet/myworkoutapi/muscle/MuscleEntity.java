package com.avernet.myworkoutapi.muscle;

import com.avernet.myworkoutapi.musclegroup.MuscleGroupEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "muscles")
@Data
public class MuscleEntity {
    @Id
    Long id;

    @Column()
    String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "muscle_group_id")
    MuscleGroupEntity muscleGroup;
}
