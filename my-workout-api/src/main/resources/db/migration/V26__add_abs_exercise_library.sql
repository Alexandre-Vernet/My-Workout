INSERT INTO public.exercises
(id, "name", description, difficulty, mechanic)
VALUES (199, 'Rotation du buste à la machine',
        '1. Asseyez-vous sur la machine, le dos droit et les pieds correctement positionnés, puis placez vos mains sur les poignées prévues à cet effet.

2. Réglez la machine afin que votre amplitude de rotation soit confortable et adaptée à votre mobilité.

3. Contractez les abdominaux et maintenez le bassin stable pendant toute l''exécution du mouvement.

4. Faites pivoter lentement le buste sur un côté en contractant les obliques, sans donner d''à-coup ni utiliser l''élan.

5. Revenez progressivement à la position de départ, puis effectuez le même mouvement de l''autre côté en gardant le mouvement contrôlé.',
        'BEGINNER',
        'ISOLATION');

INSERT INTO public.exercise_muscle
(exercise_id, muscle_id)
VALUES
    (199, 20);

SELECT setval('exercises_id_seq', (SELECT MAX(id) FROM exercises));
