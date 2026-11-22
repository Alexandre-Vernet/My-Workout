CREATE TABLE public.gym
(
    id      bigserial         NOT NULL,
    name    varchar           NOT NULL,
    user_id bigint            NOT NULL,
    active  bool DEFAULT true NOT NULL,
    CONSTRAINT gym_pk PRIMARY KEY (id),
    CONSTRAINT gym_unique UNIQUE (name, user_id),
    CONSTRAINT gym_users_fk FOREIGN KEY (user_id) REFERENCES public.users (id)
);


ALTER TABLE public.workout
    ADD gym_id bigint NULL;
ALTER TABLE public.workout
    ADD CONSTRAINT workout_gym_fk FOREIGN KEY (gym_id) REFERENCES public.gym (id);



BEGIN;

-- 1. Créer une salle pour chaque utilisateur
INSERT INTO public.gym (name, user_id)
SELECT 'Salle 1', u.id
FROM public.users u ON CONFLICT (name, user_id) DO NOTHING;


-- 2. Associer chaque workout au gym de son utilisateur
UPDATE public.workout w
SET gym_id = g.id FROM public.gym g
WHERE g.user_id = w.user_id
  AND g.name = 'Salle 1';


ALTER TABLE public.workout ALTER COLUMN gym_id SET NOT NULL;

COMMIT;
