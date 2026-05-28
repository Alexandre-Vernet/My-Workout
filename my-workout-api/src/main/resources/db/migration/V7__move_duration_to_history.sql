ALTER TABLE public.history ADD duration int4 NULL;

UPDATE history h
SET duration = w.duration
    FROM workout w
WHERE h.workout_id = w.id;

ALTER TABLE workout
DROP COLUMN duration;
