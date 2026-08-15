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
    Long id;

    @NotBlank
    @Size(max = 40)
    String name;

    String description;

    List<Muscle> muscles;

    ExerciseDifficultyEnum difficulty;

    ExerciseMechanicEnum mechanic;
}
