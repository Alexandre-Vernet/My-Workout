
CREATE TABLE public.exercises
(
    id               bigserial          NOT NULL,
    "name"           varchar(255)       NOT NULL,
    description      text NULL,
    is_smart_workout bool DEFAULT false NOT NULL,
    CONSTRAINT exercises_name_key UNIQUE (name),
    CONSTRAINT exercises_pkey PRIMARY KEY (id)
);

CREATE TABLE public.users
(
    id         bigserial               NOT NULL,
    email      varchar(255)            NOT NULL,
    "password" varchar(255)            NOT NULL,
    created_at timestamp DEFAULT now() NOT NULL,
    updated_at timestamp DEFAULT now() NOT NULL,
    is_admin   bool      DEFAULT false NOT NULL,
    CONSTRAINT users_email_key UNIQUE (email),
    CONSTRAINT users_pkey PRIMARY KEY (id)
);

CREATE TABLE public.user_exercise
(
    id          bigserial NOT NULL,
    user_id     int8      NOT NULL,
    exercise_id int8      NOT NULL,
    "order"     int4 NULL,
    CONSTRAINT user_exercise_pkey PRIMARY KEY (id),
    CONSTRAINT workout_exercise_id_fkey FOREIGN KEY (exercise_id) REFERENCES public.exercises (id) ON DELETE CASCADE,
    CONSTRAINT workout_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users (id) ON DELETE CASCADE
);

CREATE TABLE public.muscle_group
(
    id     bigserial    NOT NULL,
    "name" varchar(255) NOT NULL,
    CONSTRAINT muscle_group_name_key UNIQUE (name),
    CONSTRAINT muscle_group_pkey PRIMARY KEY (id)
);

CREATE TABLE public.muscles
(
    id              bigserial    NOT NULL,
    muscle_group_id int4         NOT NULL,
    "name"          varchar(255) NOT NULL,
    CONSTRAINT muscles_name_key UNIQUE (name),
    CONSTRAINT muscles_pkey PRIMARY KEY (id),
    CONSTRAINT muscles_muscle_group_id_fkey FOREIGN KEY (muscle_group_id) REFERENCES public.muscle_group (id) ON DELETE CASCADE
);

CREATE TABLE public.workout
(
    id              bigserial NOT NULL,
    user_id         int8      NOT NULL,
    muscle_group_id int4      NOT NULL,
    "date"          date      NOT NULL,
    duration        int4 NULL,
    CONSTRAINT workout_pkey PRIMARY KEY (id),
    CONSTRAINT workout_muscle_group_id_fkey FOREIGN KEY (muscle_group_id) REFERENCES public.muscle_group (id) ON DELETE CASCADE,
    CONSTRAINT workout_user_id_fkey1 FOREIGN KEY (user_id) REFERENCES public.users (id) ON DELETE CASCADE
);

CREATE TABLE public.history
(
    id          bigserial NOT NULL,
    exercise_id int8      NOT NULL,
    weight      float4 NULL,
    workout_id  int8      NOT NULL,
    reps        int2 NULL,
    CONSTRAINT history_pkey PRIMARY KEY (id),
    CONSTRAINT fk_workout_id FOREIGN KEY (workout_id) REFERENCES public.workout (id) ON DELETE CASCADE,
    CONSTRAINT history_exercise_id_fkey FOREIGN KEY (exercise_id) REFERENCES public.exercises (id) ON DELETE CASCADE
);

CREATE TABLE public.exercise_muscle
(
    id          bigserial NOT NULL,
    exercise_id int8      NOT NULL,
    muscle_id   int8      NOT NULL,
    CONSTRAINT exercise_muscle_pkey PRIMARY KEY (id),
    CONSTRAINT exercise_muscle_exercise_id_fkey FOREIGN KEY (exercise_id) REFERENCES public.exercises (id) ON DELETE CASCADE,
    CONSTRAINT exercise_muscle_muscle_id_fkey FOREIGN KEY (muscle_id) REFERENCES public.muscles (id) ON DELETE CASCADE
);
