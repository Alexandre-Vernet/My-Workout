package com.avernet.myworkoutapi.history;

import com.avernet.myworkoutapi.exercise.Exercise;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class HistoryGroup {
    Exercise exercise;
    List<History> histories;
}
