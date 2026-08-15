import { Muscle } from './Muscle';

export interface Exercise {
    id?: number;
    name?: string;
    description?: string;
    muscles?: Muscle[];
    difficulty?: string;
    mechanic?: string;
}
