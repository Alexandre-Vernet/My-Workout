CREATE TABLE muscle_group
(
    id   SERIAL PRIMARY KEY,
    name VARCHAR(20) UNIQUE NOT NULL
);


CREATE TABLE exercises
(
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(50) NOT NULL,
    description TEXT
);


CREATE TABLE muscles
(
    id              SERIAL PRIMARY KEY,
    muscle_group_id INT REFERENCES muscle_group (id) ON DELETE cascade,
    name            VARCHAR(30) UNIQUE NOT NULL
);


CREATE TABLE exercise_muscle
(
    id          SERIAL PRIMARY KEY,
    exercise_id INT REFERENCES exercises (id) ON DELETE cascade,
    muscle_id   INT REFERENCES muscles (id) ON DELETE CASCADE
);


CREATE TABLE users
(
    id         SERIAL PRIMARY KEY,
    email      VARCHAR(50),
    password   VARCHAR(200),
    created_at DATE,
    updated_at DATE
);


CREATE TABLE workout
(
    id          SERIAL PRIMARY KEY,
    user_id     INT REFERENCES users (id) ON DELETE CASCADE,
    exercise_id INT REFERENCES exercises (id) ON DELETE CASCADE
);


INSERT INTO muscle_group (name)
VALUES ('Pectoraux'),
       ('Triceps'),
       ('Jambes'),
       ('Épaules'),
       ('Dos'),
       ('Biceps'),
       ('Abdominaux'),
       ('Cardio');

INSERT INTO muscles (name, muscle_group_id)
VALUES
-- Pectoraux
('Pectoraux', (SELECT id FROM muscle_group WHERE name = 'Pectoraux')),

-- Triceps
('Triceps', (SELECT id FROM muscle_group WHERE name = 'Triceps')),

-- Jambes
('Quadriceps', (SELECT id FROM muscle_group WHERE name = 'Jambes')),
('Ischio-jambiers', (SELECT id FROM muscle_group WHERE name = 'Jambes')),
('Fessier', (SELECT id FROM muscle_group WHERE name = 'Jambes')),
('Mollets', (SELECT id FROM muscle_group WHERE name = 'Jambes')),

-- Épaules
('Deltoïdes antérieurs', (SELECT id FROM muscle_group WHERE name = 'Épaules')),
('Deltoïdes moyens', (SELECT id FROM muscle_group WHERE name = 'Épaules')),
('Deltoïdes postérieurs', (SELECT id FROM muscle_group WHERE name = 'Épaules')),

-- Dos
('Trapèzes', (SELECT id FROM muscle_group WHERE name = 'Dos')),
('Grand dorsal', (SELECT id FROM muscle_group WHERE name = 'Dos')),
('Grand rond', (SELECT id FROM muscle_group WHERE name = 'Dos')),
('Petit rond', (SELECT id FROM muscle_group WHERE name = 'Dos')),
('Lombaires', (SELECT id FROM muscle_group WHERE name = 'Dos')),

-- Biceps
('Biceps', (SELECT id FROM muscle_group WHERE name = 'Biceps')),
('Biceps courts', (SELECT id FROM muscle_group WHERE name = 'Biceps')),
('Biceps longs', (SELECT id FROM muscle_group WHERE name = 'Biceps')),

-- Abdos
('Grand droit - Haut', (SELECT id FROM muscle_group WHERE name = 'Abdominaux')),
('Grand droit - Bas', (SELECT id FROM muscle_group WHERE name = 'Abdominaux')),
('Obliques', (SELECT id FROM muscle_group WHERE name = 'Abdominaux')),
('Transverse', (SELECT id FROM muscle_group WHERE name = 'Abdominaux')),

-- Cardio
('Cardio', (SELECT id FROM muscle_group WHERE name = 'Cardio'));


INSERT INTO exercises (name)
VALUES
-- Pectoraux
('Développé couché'),
('Développé incliné (30°)'),
('Écartés poulie haute'),
('Écarté unilatéral'),

-- Triceps
('Extension verticale'),
('Tirage poulie haute'),
('Tirage poulie basse'),
('Pompes serrées'),

-- Jambes
('Squats'),
('Leg curl'),
('Fentes (barre)'),
('Extension mollets'),

-- Épaules
('Élévation latérales'),
('Développé militaire (45°)'),
('Rameur'),

-- Dos
('Tractions prise large'),
('Tractions prise neutre'),
('Tractions prise serrée'),

-- Biceps
('Curl'),
('Traction supination'),
('Curl haltères marteau'),
('Curl inversé barre'),

-- Abdominaux
('Crunch à la poulie haute'),
('Relevé jambes barre'),
('Crunch'),
('Gainage sur 1 main'),
('Gainage sur 2 mains'),

-- Cardio
('Course à pied');

-- Pectoraux
INSERT INTO exercise_muscle (exercise_id, muscle_id)
VALUES ((SELECT id FROM exercises WHERE name = 'Développé couché'), (SELECT id FROM muscles WHERE name = 'Pectoraux')),
       ((SELECT id FROM exercises WHERE name = 'Développé incliné (30°)'),
        (SELECT id FROM muscles WHERE name = 'Pectoraux')),
       ((SELECT id FROM exercises WHERE name = 'Écartés poulie haute'),
        (SELECT id FROM muscles WHERE name = 'Pectoraux')),
       ((SELECT id FROM exercises WHERE name = 'Écarté unilatéral'), (SELECT id FROM muscles WHERE name = 'Pectoraux'));

-- Triceps
INSERT INTO exercise_muscle (exercise_id, muscle_id)
VALUES ((SELECT id FROM exercises WHERE name = 'Extension verticale'), (SELECT id FROM muscles WHERE name = 'Triceps')),
       ((SELECT id FROM exercises WHERE name = 'Tirage poulie haute'), (SELECT id FROM muscles WHERE name = 'Triceps')),
       ((SELECT id FROM exercises WHERE name = 'Tirage poulie basse'), (SELECT id FROM muscles WHERE name = 'Triceps')),
       ((SELECT id FROM exercises WHERE name = 'Pompes serrées'), (SELECT id FROM muscles WHERE name = 'Triceps'));

-- Jambes
INSERT INTO exercise_muscle (exercise_id, muscle_id)
VALUES ((SELECT id FROM exercises WHERE name = 'Squats'), (SELECT id FROM muscles WHERE name = 'Quadriceps')),
       ((SELECT id FROM exercises WHERE name = 'Squats'), (SELECT id FROM muscles WHERE name = 'Ischio-jambiers')),
       ((SELECT id FROM exercises WHERE name = 'Squats'), (SELECT id FROM muscles WHERE name = 'Fessier')),
       ((SELECT id FROM exercises WHERE name = 'Leg curl'), (SELECT id FROM muscles WHERE name = 'Ischio-jambiers')),
       ((SELECT id FROM exercises WHERE name = 'Fentes (barre)'), (SELECT id FROM muscles WHERE name = 'Quadriceps')),
       ((SELECT id FROM exercises WHERE name = 'Fentes (barre)'), (SELECT id FROM muscles WHERE name = 'Quadriceps')),
       ((SELECT id FROM exercises WHERE name = 'Extension mollets'), (SELECT id FROM muscles WHERE name = 'Mollets'));

-- Épaules
INSERT INTO exercise_muscle (exercise_id, muscle_id)
VALUES ((SELECT id FROM exercises WHERE name = 'Élévation latérales'),
        (SELECT id FROM muscles WHERE name = 'Deltoïdes moyens')),

       ((SELECT id FROM exercises WHERE name = 'Développé militaire (45°)'),
        (SELECT id FROM muscles WHERE name = 'Deltoïdes antérieurs')),

       ((SELECT id FROM exercises WHERE name = 'Rameur'), (SELECT id FROM muscles WHERE name = 'Deltoïdes postérieurs'));

-- Dos
INSERT INTO exercise_muscle (exercise_id, muscle_id)
VALUES ((SELECT id FROM exercises WHERE name = 'Tractions prise large'),
        (SELECT id FROM muscles WHERE name = 'Grand dorsal')),
       ((SELECT id FROM exercises WHERE name = 'Tractions prise large'),
        (SELECT id FROM muscles WHERE name = 'Trapèzes')),
       ((SELECT id FROM exercises WHERE name = 'Tractions prise neutre'),
        (SELECT id FROM muscles WHERE name = 'Grand dorsal')),
       ((SELECT id FROM exercises WHERE name = 'Tractions prise neutre'),
        (SELECT id FROM muscles WHERE name = 'Trapèzes')),
       ((SELECT id FROM exercises WHERE name = 'Tractions prise serrée'),
        (SELECT id FROM muscles WHERE name = 'Grand dorsal')),
       ((SELECT id FROM exercises WHERE name = 'Tractions prise serrée'),
        (SELECT id FROM muscles WHERE name = 'Grand rond'));

-- Biceps
INSERT INTO exercise_muscle (exercise_id, muscle_id)
VALUES ((SELECT id FROM exercises WHERE name = 'Curl'), (SELECT id FROM muscles WHERE name = 'Biceps')),
       ((SELECT id FROM exercises WHERE name = 'Traction supination'), (SELECT id FROM muscles WHERE name = 'Biceps')),
       ((SELECT id FROM exercises WHERE name = 'Curl haltères marteau'), (SELECT id FROM muscles WHERE name = 'Biceps')),
       ((SELECT id FROM exercises WHERE name = 'Curl inversé barre'), (SELECT id FROM muscles WHERE name = 'Biceps'));

-- Abdominaux
INSERT INTO exercise_muscle (exercise_id, muscle_id)
VALUES ((SELECT id FROM exercises WHERE name = 'Crunch à la poulie haute'),
        (SELECT id FROM muscles WHERE name = 'Grand droit - Haut')),
       ((SELECT id FROM exercises WHERE name = 'Relevé jambes barre'),
        (SELECT id FROM muscles WHERE name = 'Grand droit - Bas')),
       ((SELECT id FROM exercises WHERE name = 'Crunch'), (SELECT id FROM muscles WHERE name = 'Grand droit - Haut')),
       ((SELECT id FROM exercises WHERE name = 'Gainage sur 1 main'), (SELECT id FROM muscles WHERE name = 'Transverse')),
       ((SELECT id FROM exercises WHERE name = 'Gainage sur 2 mains'),
        (SELECT id FROM muscles WHERE name = 'Transverse'));


-- Cardio
INSERT INTO exercise_muscle (exercise_id, muscle_id)
VALUES ((SELECT id FROM exercises WHERE name = 'Course à pied'), (SELECT id FROM muscles WHERE name = 'Cardio'));



