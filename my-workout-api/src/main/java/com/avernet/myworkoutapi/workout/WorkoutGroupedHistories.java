package com.avernet.myworkoutapi.workout;

import com.avernet.myworkoutapi.history.HistoryGroup;
import com.avernet.myworkoutapi.musclegroup.MuscleGroup;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
public class WorkoutGroupedHistories {
    WorkoutSummary workoutSummary;
    List<HistoryGroup> historyGroups;
    MuscleGroup muscleGroup;
}
