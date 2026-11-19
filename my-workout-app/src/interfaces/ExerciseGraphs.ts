import { Exercise } from './Exercise';
import { HistoryPoint } from './HistoryPoint';

export interface ExerciseGraphs {
    exercise: Exercise;
    historyPoints: HistoryPoint[];
    totalWeight: number;
    maxWeight: number;
    totalReps: number;
}
