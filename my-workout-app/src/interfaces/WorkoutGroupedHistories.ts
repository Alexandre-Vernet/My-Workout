import { MuscleGroup } from './MuscleGroup';
import { HistoryGroup } from './HistoryGroup';
import { WorkoutSummary } from "./WorkoutSummary";
import { Gym } from './gym';

export interface WorkoutGroupedHistories {
    workoutSummary?: WorkoutSummary;
    historyGroups?: HistoryGroup[];
    muscleGroup?: MuscleGroup;
    gym?: Gym;
}
