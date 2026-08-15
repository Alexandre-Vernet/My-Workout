ALTER TABLE exercises ADD COLUMN mechanic VARCHAR(20) NOT NULL DEFAULT 'COMPOUND';

UPDATE public.exercises
SET mechanic='ISOLATION'
WHERE id = 12;
UPDATE public.exercises
SET mechanic='ISOLATION'
WHERE id = 19;
UPDATE public.exercises
SET mechanic='ISOLATION'
WHERE id = 39;
UPDATE public.exercises
SET mechanic='ISOLATION'
WHERE id = 6;
UPDATE public.exercises
SET mechanic='ISOLATION'
WHERE id = 7;
UPDATE public.exercises
SET mechanic='ISOLATION'
WHERE id = 21;
UPDATE public.exercises
SET mechanic='ISOLATION'
WHERE id = 22;
UPDATE public.exercises
SET mechanic='ISOLATION'
WHERE id = 58;
UPDATE public.exercises
SET mechanic='ISOLATION'
WHERE id = 59;
UPDATE public.exercises
SET mechanic='ISOLATION'
WHERE id = 25;
UPDATE public.exercises
SET mechanic='ISOLATION'
WHERE id = 42;
UPDATE public.exercises
SET mechanic='ISOLATION'
WHERE id = 52;
UPDATE public.exercises
SET mechanic='ISOLATION'
WHERE id = 60;
UPDATE public.exercises
SET mechanic='ISOLATION'
WHERE id = 61;
UPDATE public.exercises
SET mechanic='ISOLATION'
WHERE id = 73;
UPDATE public.exercises
SET mechanic='ISOLATION'
WHERE id = 13;
UPDATE public.exercises
SET mechanic='ISOLATION'
WHERE id = 62;
UPDATE public.exercises
SET mechanic='ISOLATION'
WHERE id = 66;
UPDATE public.exercises
SET mechanic='ISOLATION'
WHERE id = 69;
UPDATE public.exercises
SET mechanic='ISOLATION'
WHERE id = 71;
UPDATE public.exercises
SET mechanic='ISOLATION'
WHERE id = 75;
UPDATE public.exercises
SET mechanic='ISOLATION'
WHERE id = 77;
UPDATE public.exercises
SET mechanic='ISOLATION'
WHERE id = 81;
UPDATE public.exercises
SET mechanic='ISOLATION'
WHERE id = 23;
UPDATE public.exercises
SET mechanic='ISOLATION'
WHERE id = 5;
UPDATE public.exercises
SET mechanic='ISOLATION'
WHERE id = 3;
UPDATE public.exercises
SET mechanic='ISOLATION'
WHERE id = 4;
UPDATE public.exercises
SET mechanic='ISOLATION'
WHERE id = 38;
UPDATE public.exercises
SET mechanic='ISOLATION'
WHERE id = 53;
UPDATE public.exercises
SET mechanic='ISOLATION'
WHERE id = 50;
UPDATE public.exercises
SET mechanic='ISOLATION'
WHERE id = 49;
UPDATE public.exercises
SET mechanic='ISOLATION'
WHERE id = 64;
UPDATE public.exercises
SET mechanic='ISOLATION'
WHERE id = 68;
UPDATE public.exercises
SET mechanic='ISOLATION'
WHERE id = 65;
UPDATE public.exercises
SET mechanic='ISOLATION'
WHERE id = 67;
UPDATE public.exercises
SET mechanic='ISOLATION'
WHERE id = 74;
UPDATE public.exercises
SET mechanic='ISOLATION'
WHERE id = 79;
UPDATE public.exercises
SET mechanic='ISOLATION'
WHERE id = 85;
UPDATE public.exercises
SET mechanic='ISOLATION'
WHERE id = 97;
UPDATE public.exercises
SET mechanic='ISOLATION'
WHERE id = 91;
UPDATE public.exercises
SET mechanic='ISOLATION'
WHERE id = 95;
UPDATE public.exercises
SET mechanic='ISOLATION'
WHERE id = 24;
UPDATE public.exercises
SET mechanic='ISOLATION'
WHERE id = 34;



UPDATE public.exercises
SET mechanic='COMPOUND'
WHERE mechanic IS NULL;
