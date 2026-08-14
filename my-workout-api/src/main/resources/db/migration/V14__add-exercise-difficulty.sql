ALTER TABLE exercises ADD COLUMN difficulty VARCHAR(20) NOT NULL DEFAULT 'INTERMEDIATE';


UPDATE public.exercises
SET difficulty='BEGINNER'
WHERE id = 6;
UPDATE public.exercises
SET difficulty='BEGINNER'
WHERE id = 7;
UPDATE public.exercises
SET difficulty='BEGINNER'
WHERE id = 12;
UPDATE public.exercises
SET difficulty='BEGINNER'
WHERE id = 13;
UPDATE public.exercises
SET difficulty='BEGINNER'
WHERE id = 19;
UPDATE public.exercises
SET difficulty='BEGINNER'
WHERE id = 20;
UPDATE public.exercises
SET difficulty='BEGINNER'
WHERE id = 21;
UPDATE public.exercises
SET difficulty='BEGINNER'
WHERE id = 22;
UPDATE public.exercises
SET difficulty='BEGINNER'
WHERE id = 25;
UPDATE public.exercises
SET difficulty='BEGINNER'
WHERE id = 26;
UPDATE public.exercises
SET difficulty='BEGINNER'
WHERE id = 27;
UPDATE public.exercises
SET difficulty='BEGINNER'
WHERE id = 28;
UPDATE public.exercises
SET difficulty='BEGINNER'
WHERE id = 29;
UPDATE public.exercises
SET difficulty='BEGINNER'
WHERE id = 30;
UPDATE public.exercises
SET difficulty='BEGINNER'
WHERE id = 31;
UPDATE public.exercises
SET difficulty='BEGINNER'
WHERE id = 32;
UPDATE public.exercises
SET difficulty='BEGINNER'
WHERE id = 37;
UPDATE public.exercises
SET difficulty='BEGINNER'
WHERE id = 41;
UPDATE public.exercises
SET difficulty='BEGINNER'
WHERE id = 42;
UPDATE public.exercises
SET difficulty='BEGINNER'
WHERE id = 51;
UPDATE public.exercises
SET difficulty='BEGINNER'
WHERE id = 52;
UPDATE public.exercises
SET difficulty='BEGINNER'
WHERE id = 53;
UPDATE public.exercises
SET difficulty='BEGINNER'
WHERE id = 55;
UPDATE public.exercises
SET difficulty='BEGINNER'
WHERE id = 56;
UPDATE public.exercises
SET difficulty='BEGINNER'
WHERE id = 58;
UPDATE public.exercises
SET difficulty='BEGINNER'
WHERE id = 59;
UPDATE public.exercises
SET difficulty='BEGINNER'
WHERE id = 60;
UPDATE public.exercises
SET difficulty='BEGINNER'
WHERE id = 61;
UPDATE public.exercises
SET difficulty='BEGINNER'
WHERE id = 62;
UPDATE public.exercises
SET difficulty='BEGINNER'
WHERE id = 66;
UPDATE public.exercises
SET difficulty='BEGINNER'
WHERE id = 69;
UPDATE public.exercises
SET difficulty='BEGINNER'
WHERE id = 71;
UPDATE public.exercises
SET difficulty='BEGINNER'
WHERE id = 72;
UPDATE public.exercises
SET difficulty='BEGINNER'
WHERE id = 73;
UPDATE public.exercises
SET difficulty='BEGINNER'
WHERE id = 74;
UPDATE public.exercises
SET difficulty='BEGINNER'
WHERE id = 75;
UPDATE public.exercises
SET difficulty='BEGINNER'
WHERE id = 76;
UPDATE public.exercises
SET difficulty='BEGINNER'
WHERE id = 77;
UPDATE public.exercises
SET difficulty='BEGINNER'
WHERE id = 80;
UPDATE public.exercises
SET difficulty='BEGINNER'
WHERE id = 81;
UPDATE public.exercises
SET difficulty='BEGINNER'
WHERE id = 82;
UPDATE public.exercises
SET difficulty='BEGINNER'
WHERE id = 86;
UPDATE public.exercises
SET difficulty='BEGINNER'
WHERE id = 87;
UPDATE public.exercises
SET difficulty='BEGINNER'
WHERE id = 91;
UPDATE public.exercises
SET difficulty='BEGINNER'
WHERE id = 92;
UPDATE public.exercises
SET difficulty='BEGINNER'
WHERE id = 93;
UPDATE public.exercises
SET difficulty='BEGINNER'
WHERE id = 94;
UPDATE public.exercises
SET difficulty='BEGINNER'
WHERE id = 99;
UPDATE public.exercises
SET difficulty='BEGINNER'
WHERE id = 100;


-- Auto-generated SQL script #202607142049
UPDATE public.exercises
SET difficulty='INTERMEDIATE'
WHERE id = 2;
UPDATE public.exercises
SET difficulty='INTERMEDIATE'
WHERE id = 23;
UPDATE public.exercises
SET difficulty='INTERMEDIATE'
WHERE id = 1;
UPDATE public.exercises
SET difficulty='INTERMEDIATE'
WHERE id = 3;
UPDATE public.exercises
SET difficulty='INTERMEDIATE'
WHERE id = 4;
UPDATE public.exercises
SET difficulty='INTERMEDIATE'
WHERE id = 5;
UPDATE public.exercises
SET difficulty='INTERMEDIATE'
WHERE id = 8;
UPDATE public.exercises
SET difficulty='INTERMEDIATE'
WHERE id = 17;
UPDATE public.exercises
SET difficulty='INTERMEDIATE'
WHERE id = 18;
UPDATE public.exercises
SET difficulty='INTERMEDIATE'
WHERE id = 14;
UPDATE public.exercises
SET difficulty='INTERMEDIATE'
WHERE id = 16;
UPDATE public.exercises
SET difficulty='INTERMEDIATE'
WHERE id = 33;
UPDATE public.exercises
SET difficulty='INTERMEDIATE'
WHERE id = 35;
UPDATE public.exercises
SET difficulty='INTERMEDIATE'
WHERE id = 36;
UPDATE public.exercises
SET difficulty='INTERMEDIATE'
WHERE id = 38;
UPDATE public.exercises
SET difficulty='INTERMEDIATE'
WHERE id = 39;
UPDATE public.exercises
SET difficulty='INTERMEDIATE'
WHERE id = 40;
UPDATE public.exercises
SET difficulty='INTERMEDIATE'
WHERE id = 45;
UPDATE public.exercises
SET difficulty='INTERMEDIATE'
WHERE id = 47;
UPDATE public.exercises
SET difficulty='INTERMEDIATE'
WHERE id = 48;
UPDATE public.exercises
SET difficulty='INTERMEDIATE'
WHERE id = 50;
UPDATE public.exercises
SET difficulty='INTERMEDIATE'
WHERE id = 49;
UPDATE public.exercises
SET difficulty='INTERMEDIATE'
WHERE id = 57;
UPDATE public.exercises
SET difficulty='INTERMEDIATE'
WHERE id = 54;
UPDATE public.exercises
SET difficulty='INTERMEDIATE'
WHERE id = 64;
UPDATE public.exercises
SET difficulty='INTERMEDIATE'
WHERE id = 68;
UPDATE public.exercises
SET difficulty='INTERMEDIATE'
WHERE id = 65;
UPDATE public.exercises
SET difficulty='INTERMEDIATE'
WHERE id = 67;
UPDATE public.exercises
SET difficulty='INTERMEDIATE'
WHERE id = 79;
UPDATE public.exercises
SET difficulty='INTERMEDIATE'
WHERE id = 85;
UPDATE public.exercises
SET difficulty='INTERMEDIATE'
WHERE id = 97;
UPDATE public.exercises
SET difficulty='INTERMEDIATE'
WHERE id = 88;
UPDATE public.exercises
SET difficulty='INTERMEDIATE'
WHERE id = 89;
UPDATE public.exercises
SET difficulty='INTERMEDIATE'
WHERE id = 90;



UPDATE public.exercises
SET difficulty='ADVANCED'
WHERE difficulty is NULL;

ALTER TABLE public.exercises
    ALTER COLUMN description SET NOT NULL;
ALTER TABLE public.exercises
    ALTER COLUMN difficulty SET NOT NULL;
