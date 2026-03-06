package com.avernet.myworkoutapi.musclegroup;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "muscle_group")
@Data
public class MuscleGroupEntity {
    @Id
    Long id;

    @Column()
    String name;
}
