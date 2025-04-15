import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class ExercisesService {
    constructor(
        private dataSource: DataSource
    ) {
    }

    async findExercisesByMuscleGroupId(userId: number, muscleGroupId: number) {
        return this.dataSource.query(
            `
                SELECT e.id,
                       e.name,
                       e.description,
                       CASE
                           WHEN w.id IS NOT NULL THEN true
                           ELSE false
                           END                  AS "addedToWorkout",
                       STRING_AGG(DISTINCT m.name, ', ') AS "muscleGroup"
                FROM exercises e
                         LEFT JOIN workout w ON
                    e.id = w.exercise_id AND w.user_id = $1
                         JOIN exercise_muscle em ON
                    em.exercise_id = e.id
                         JOIN muscles m ON
                    em.muscle_id = m.id
                         JOIN muscle_group mg ON m.muscle_group_id = mg.id
                WHERE m.muscle_group_id = $2
                GROUP BY e.id, e.name, e.description, w.id;
            `,
            [userId, muscleGroupId]
        );
    }
}
