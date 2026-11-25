-- muscle_group.id was created as a plain serial (int4) instead of the bigserial
-- declared in V1__init.sql, and the two columns referencing it followed the same
-- int4 declaration. Entities use Long ids, so Hibernate schema validation fails on
-- startup against any database carrying this older int4 schema. Widening int4 to
-- int8 is a no-op on a database where these columns are already bigint.
ALTER TABLE public.muscle_group ALTER COLUMN id TYPE bigint;
ALTER TABLE public.muscles ALTER COLUMN muscle_group_id TYPE bigint;
ALTER TABLE public.workout ALTER COLUMN muscle_group_id TYPE bigint;
