-- PostgreSQL does not index foreign key columns automatically. Only the ones that the
-- application actually filters or joins on, on tables that grow with usage, are indexed here.
-- Each composite index also serves lookups on its first column alone.

-- Every user-scoped workout query (calendar, today's workout, stats, graphs) filters on
-- user_id, most of them with a date range as well. Also used by ON DELETE CASCADE on users.
CREATE INDEX idx_workout_user_id_date ON public.workout (user_id, "date");

-- The biggest table: one row per logged set. Reached from a workout (session detail, stats,
-- graphs, ON DELETE CASCADE on workout), then usually filtered by exercise.
CREATE INDEX idx_history_workout_id_exercise_id ON public.history (workout_id, exercise_id);

-- Looked up by (user, exercise) on every exercise screen ("added to my workout" state,
-- toggle) and by user for the stats. Also used by ON DELETE CASCADE on users.
CREATE INDEX idx_user_exercise_user_id_exercise_id ON public.user_exercise (user_id, exercise_id);

-- Deliberately not indexed:
--  - gym.user_id, password_reset_token.user_id: a few rows per user (reset tokens are purged
--    daily); a sequential scan stays cheaper than maintaining an index.
--  - workout.gym_id: always queried together with user_id, which idx_workout_user_id_date
--    already narrows down. It would only help when a gym row is deleted, which only happens
--    on account deletion.
--  - workout.muscle_group_id, muscles.muscle_group_id, exercise_muscle.*, history.exercise_id
--    alone: either reference tables of a few dozen to a few hundred rows that only change
--    through migrations, or queries already narrowed down by the indexes above.
