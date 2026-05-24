ALTER TABLE public.history ADD unilateral boolean NOT NULL DEFAULT FALSE;

ALTER TABLE public.history ALTER COLUMN unilateral DROP DEFAULT;
