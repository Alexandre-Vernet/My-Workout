import { Muscle } from './Muscle';

export interface Exercise {
    id?: number;
    name?: string;
    description?: string;
    muscles?: Muscle[];
    difficulty?: string; /*TODO REMOVE NULLABLE*/
    mechanic?: string; /*TODO REMOVE NULLABLE*/
}
