DELETE FROM public.exercises
WHERE id=104;

UPDATE public.exercises
SET "name"='Tirage horizontal à la machine'
WHERE id=92;


UPDATE public.exercises
SET "name"='Hip thrust à la machine'
WHERE id=44;


UPDATE public.exercises
SET "name"='Développé couché au sol'
WHERE id=82;

DELETE FROM public.exercises
WHERE id=32;
DELETE FROM public.exercises
WHERE id=31;

UPDATE public.exercises
SET "name"='Relevé de jambes à la machine'
WHERE id=34;

DELETE FROM public.exercises
WHERE id=63;


SELECT setval('exercises_id_seq', (SELECT MAX(id) FROM exercises));
