import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class ExercisesService {
    constructor(
        private dataSource: DataSource
    ) {
    }

    findAllExercisesByMuscleGroupIdAndUserId(userId: number, muscleGroupId: number) {
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

    findExercisesByMuscleGroupIdAndUserId(userId: number, muscleGroupId: number) {
        return this.dataSource.query(
            `
                select e.id,
                       e.name,
                       e.description
                from exercises e
                         left join workout w on
                    e.id = w.exercise_id
                         join exercise_muscle em on
                    em.exercise_id = e.id
                         join muscles m on
                    em.muscle_id = m.id
                         join muscle_group mg on
                    m.muscle_group_id = mg.id
                where w.user_id = $1
                  and m.muscle_group_id = $2
                group by e.id,
                         e.name,
                         e.description,
                         w.id;
            `,
            [userId, muscleGroupId]
        );
    }
}
