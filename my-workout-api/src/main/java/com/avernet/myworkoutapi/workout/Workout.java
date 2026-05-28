package com.avernet.myworkoutapi.workout;

import com.avernet.myworkoutapi.history.History;
import com.avernet.myworkoutapi.musclegroup.MuscleGroup;
import com.avernet.myworkoutapi.user.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Workout {
    Long id;
    LocalDateTime date;
    User user;
    MuscleGroup muscleGroup;
    List<History> histories = new ArrayList<>();
}
