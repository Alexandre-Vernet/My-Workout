import { MuscleGroup } from './MuscleGroup';
import { HistoryGroup } from './HistoryGroup';
import { WorkoutSummary } from "./WorkoutSummary";

export class WorkoutGroupedHistories {
    workoutSummary?: WorkoutSummary;
    historyGroups?: HistoryGroup[];
    muscleGroup?: MuscleGroup;
}
