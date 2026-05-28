ALTER TABLE public.history ALTER COLUMN reps DROP NOT NULL;

update history h
set reps = null
    from workout w
where h.reps = 0
  and w.muscle_group_id = 8;
