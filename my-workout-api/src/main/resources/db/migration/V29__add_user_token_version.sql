-- Embedded in every JWT and checked on each request: incrementing it (password change or
-- reset) revokes all the tokens issued before.
ALTER TABLE public.users
    ADD COLUMN token_version int4 DEFAULT 0 NOT NULL;
