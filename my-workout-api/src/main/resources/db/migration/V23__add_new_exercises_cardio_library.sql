INSERT INTO public.exercises
(id, "name", description, difficulty, mechanic)
VALUES (178, 'Burpee',
        '1. Placez-vous debout, les pieds écartés à la largeur des épaules et les bras le long du corps.

2. Accroupissez-vous puis posez les mains au sol devant vous.

3. Envoyez les pieds vers l''arrière pour vous retrouver en position de planche, en gardant le corps gainé.

4. Ramenez rapidement les pieds vers les mains puis relevez-vous en poussant dans les jambes.

5. Effectuez un saut vertical en levant les bras au-dessus de la tête, puis atterrissez de manière contrôlée avant d''enchaîner la répétition suivante.',
        'INTERMEDIATE',
        'COMPOUND');

INSERT INTO public.exercise_muscle
(exercise_id, muscle_id)
VALUES
    (178, 22),
    (178, 24);


INSERT INTO public.exercises
(id, "name", description, difficulty, mechanic)
VALUES (179, 'Corde à sauter',
        '1. Tenez les poignées de la corde à sauter, les coudes légèrement fléchis et les bras proches du corps.

2. Placez-vous debout, les pieds joints ou légèrement écartés, avec le dos droit et le regard vers l''avant.

3. Faites tourner la corde principalement avec les poignets et sautez légèrement lorsque celle-ci passe sous vos pieds.

4. Gardez les sauts bas et réguliers, en atterrissant souplement sur l''avant des pieds.

5. Maintenez un rythme constant en gardant les épaules détendues et les mouvements contrôlés.',
        'BEGINNER',
        'COMPOUND');

INSERT INTO public.exercise_muscle
(exercise_id, muscle_id)
VALUES
    (179, 22),
    (179, 24);

INSERT INTO public.exercises
(id, "name", description, difficulty, mechanic)
VALUES (180, 'Marche sur escalier mécanique',
        '1. Montez sur le stepmill et placez-vous droit, en gardant le regard vers l''avant et le tronc légèrement gainé.

2. Commencez à monter les marches à un rythme régulier, en posant chaque pied de manière stable sur une marche.

3. Gardez une posture naturelle et évitez de vous suspendre aux poignées ; utilisez-les uniquement pour maintenir votre équilibre si nécessaire.

4. Maintenez une cadence régulière pendant toute la durée de l''exercice en contrôlant chaque pas.',
        'BEGINNER',
        'COMPOUND');

INSERT INTO public.exercise_muscle
(exercise_id, muscle_id)
VALUES
    (180, 22),
    (180, 23),
    (180, 24);


SELECT setval('exercises_id_seq', (SELECT MAX(id) FROM exercises));
