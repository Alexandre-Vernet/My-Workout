package com.avernet.myworkoutapi.exercise;

import com.avernet.myworkoutapi.muscle.Muscle;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class Exercise {
    public static final int NAME_MAX_LENGTH = 40;
    // Matches the exercises.description column, so an oversized payload is rejected as a
    // validation error instead of failing later on the database constraint.
    public static final int DESCRIPTION_MAX_LENGTH = 2000;

    Long id;

    @NotBlank
    @Size(max = NAME_MAX_LENGTH)
    String name;

    @Size(max = DESCRIPTION_MAX_LENGTH, message = "2000 caractères max.")
    String description;

    List<Muscle> muscles;

    ExerciseDifficultyEnum difficulty;

    ExerciseMechanicEnum mechanic;

    Integer order;
}
