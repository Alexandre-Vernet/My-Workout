CREATE TABLE muscle_group
(
  id   SERIAL PRIMARY KEY,
  name VARCHAR(20) UNIQUE NOT NULL
);


CREATE TABLE exercise
(
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(50) NOT NULL,
  description TEXT
);


CREATE TABLE muscle
(
  id              SERIAL PRIMARY KEY,
  muscle_group_id INT REFERENCES muscle_group (id) ON DELETE cascade,
  name            VARCHAR(30) UNIQUE NOT NULL
);


CREATE TABLE exercise_muscle
(
  id          SERIAL PRIMARY KEY,
  exercise_id INT REFERENCES exercise (id) ON DELETE cascade,
  muscle_id   INT REFERENCES muscle (id) ON DELETE CASCADE
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

INSERT INTO muscle (name, muscle_group_id)
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


INSERT INTO exercise (name)
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
VALUES ((SELECT id FROM exercise WHERE name = 'Développé couché'), (SELECT id FROM muscle WHERE name = 'Pectoraux')),
       ((SELECT id FROM exercise WHERE name = 'Développé incliné (30°)'),
        (SELECT id FROM muscle WHERE name = 'Pectoraux')),
       ((SELECT id FROM exercise WHERE name = 'Écartés poulie haute'),
        (SELECT id FROM muscle WHERE name = 'Pectoraux')),
       ((SELECT id FROM exercise WHERE name = 'Écarté unilatéral'), (SELECT id FROM muscle WHERE name = 'Pectoraux'));

-- Triceps
INSERT INTO exercise_muscle (exercise_id, muscle_id)
VALUES ((SELECT id FROM exercise WHERE name = 'Extension verticale'), (SELECT id FROM muscle WHERE name = 'Triceps')),
       ((SELECT id FROM exercise WHERE name = 'Tirage poulie haute'), (SELECT id FROM muscle WHERE name = 'Triceps')),
       ((SELECT id FROM exercise WHERE name = 'Tirage poulie basse'), (SELECT id FROM muscle WHERE name = 'Triceps')),
       ((SELECT id FROM exercise WHERE name = 'Pompes serrées'), (SELECT id FROM muscle WHERE name = 'Triceps'));

-- Jambes
INSERT INTO exercise_muscle (exercise_id, muscle_id)
VALUES ((SELECT id FROM exercise WHERE name = 'Squats'), (SELECT id FROM muscle WHERE name = 'Quadriceps')),
       ((SELECT id FROM exercise WHERE name = 'Squats'), (SELECT id FROM muscle WHERE name = 'Ischio-jambiers')),
       ((SELECT id FROM exercise WHERE name = 'Squats'), (SELECT id FROM muscle WHERE name = 'Fessier')),
       ((SELECT id FROM exercise WHERE name = 'Leg curl'), (SELECT id FROM muscle WHERE name = 'Ischio-jambiers')),
       ((SELECT id FROM exercise WHERE name = 'Fentes (barre)'), (SELECT id FROM muscle WHERE name = 'Quadriceps')),
       ((SELECT id FROM exercise WHERE name = 'Fentes (barre)'), (SELECT id FROM muscle WHERE name = 'Quadriceps')),
       ((SELECT id FROM exercise WHERE name = 'Extension mollets'), (SELECT id FROM muscle WHERE name = 'Mollets'));

-- Épaules
INSERT INTO exercise_muscle (exercise_id, muscle_id)
VALUES ((SELECT id FROM exercise WHERE name = 'Élévation latérales'),
        (SELECT id FROM muscle WHERE name = 'Deltoïdes antérieurs')),
       ((SELECT id FROM exercise WHERE name = 'Développé militaire (45°)'),
        (SELECT id FROM muscle WHERE name = 'Deltoïdes antérieurs')),
       ((SELECT id FROM exercise WHERE name = 'Rameur'), (SELECT id FROM muscle WHERE name = 'Deltoïdes moyens'));

-- Dos
INSERT INTO exercise_muscle (exercise_id, muscle_id)
VALUES ((SELECT id FROM exercise WHERE name = 'Tractions prise large'),
        (SELECT id FROM muscle WHERE name = 'Grand dorsal')),
       ((SELECT id FROM exercise WHERE name = 'Tractions prise large'),
        (SELECT id FROM muscle WHERE name = 'Trapèzes')),
       ((SELECT id FROM exercise WHERE name = 'Tractions prise neutre'),
        (SELECT id FROM muscle WHERE name = 'Grand dorsal')),
       ((SELECT id FROM exercise WHERE name = 'Tractions prise neutre'),
        (SELECT id FROM muscle WHERE name = 'Trapèzes')),
       ((SELECT id FROM exercise WHERE name = 'Tractions prise serrée'),
        (SELECT id FROM muscle WHERE name = 'Grand dorsal')),
       ((SELECT id FROM exercise WHERE name = 'Tractions prise serrée'),
        (SELECT id FROM muscle WHERE name = 'Grand rond'));

-- Biceps
INSERT INTO exercise_muscle (exercise_id, muscle_id)
VALUES ((SELECT id FROM exercise WHERE name = 'Curl'), (SELECT id FROM muscle WHERE name = 'Biceps')),
       ((SELECT id FROM exercise WHERE name = 'Traction supination'), (SELECT id FROM muscle WHERE name = 'Biceps')),
       ((SELECT id FROM exercise WHERE name = 'Curl haltères marteau'), (SELECT id FROM muscle WHERE name = 'Biceps')),
       ((SELECT id FROM exercise WHERE name = 'Curl inversé barre'), (SELECT id FROM muscle WHERE name = 'Biceps'));

-- Abdominaux
INSERT INTO exercise_muscle (exercise_id, muscle_id)
VALUES ((SELECT id FROM exercise WHERE name = 'Crunch à la poulie haute'),
        (SELECT id FROM muscle WHERE name = 'Grand droit - Haut')),
       ((SELECT id FROM exercise WHERE name = 'Relevé jambes barre'),
        (SELECT id FROM muscle WHERE name = 'Grand droit - Bas')),
       ((SELECT id FROM exercise WHERE name = 'Crunch'), (SELECT id FROM muscle WHERE name = 'Grand droit - Haut')),
       ((SELECT id FROM exercise WHERE name = 'Gainage sur 1 main'), (SELECT id FROM muscle WHERE name = 'Transverse')),
       ((SELECT id FROM exercise WHERE name = 'Gainage sur 2 mains'),
        (SELECT id FROM muscle WHERE name = 'Transverse'));



-- Cardio
INSERT INTO exercise_muscle (exercise_id, muscle_id)
VALUES ((SELECT id FROM exercise WHERE name = 'Course à pied'), (SELECT id FROM muscle WHERE name = 'Cardio'));



