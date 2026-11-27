import {Exercise} from './Exercise';
import { History } from './History';

export interface HistoryGroup {
    exercise?: Exercise;
    histories: History[];
}
