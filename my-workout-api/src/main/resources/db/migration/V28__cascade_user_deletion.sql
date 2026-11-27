-- Deleting a user failed as soon as they owned a gym or had requested a password reset:
-- unlike every other table referencing users, these two had no ON DELETE CASCADE.

ALTER TABLE public.gym
    DROP CONSTRAINT gym_users_fk;
ALTER TABLE public.gym
    ADD CONSTRAINT gym_users_fk FOREIGN KEY (user_id) REFERENCES public.users (id) ON DELETE CASCADE;


-- password_reset_token was never created by a migration: Hibernate generated it (ddl-auto),
-- with an auto-named foreign key. Create it here when missing (fresh database), so the
-- schema no longer depends on Hibernate, then replace whatever foreign key it has.
CREATE TABLE IF NOT EXISTS public.password_reset_token
(
    id              bigserial    NOT NULL,
    token           varchar(255) NOT NULL,
    expiration_date timestamp(6) NOT NULL,
    used            bool         NOT NULL,
    user_id         int8         NOT NULL,
    CONSTRAINT password_reset_token_pkey PRIMARY KEY (id),
    CONSTRAINT password_reset_token_token_key UNIQUE (token)
);

DO
$$
    DECLARE
        foreign_key record;
    BEGIN
        FOR foreign_key IN
            SELECT conname
            FROM pg_constraint
            WHERE conrelid = 'public.password_reset_token'::regclass
              AND contype = 'f'
            LOOP
                EXECUTE format('ALTER TABLE public.password_reset_token DROP CONSTRAINT %I', foreign_key.conname);
            END LOOP;
    END
$$;

ALTER TABLE public.password_reset_token
    ADD CONSTRAINT password_reset_token_users_fk FOREIGN KEY (user_id) REFERENCES public.users (id) ON DELETE CASCADE;
