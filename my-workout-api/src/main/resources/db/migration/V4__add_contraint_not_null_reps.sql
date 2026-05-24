update history SET reps = 0 where reps IS NULL;

ALTER TABLE public.history ALTER COLUMN reps SET NOT NULL;
