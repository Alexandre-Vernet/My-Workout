INSERT INTO public.exercises
(id, "name", description, difficulty, mechanic)
VALUES (156, 'Rowing à la barre',
        '1. Placez-vous debout, les pieds écartés à la largeur des épaules, et tenez une barre avec une prise pronation légèrement plus large que les épaules.

2. Inclinez le buste vers l''avant en gardant le dos droit, les genoux légèrement fléchis et la tête dans l''alignement de la colonne.

3. Tirez la barre vers le haut de la poitrine en écartant les coudes sur les côtés afin de solliciter principalement les deltoïdes postérieurs.

4. Marquez une courte pause en position haute en contractant les deltoïdes postérieurs, puis redescendez lentement la barre en contrôlant le mouvement.

5. Répétez le mouvement sans utiliser d''élan et en maintenant le buste stable pendant toute l''exécution.',
        'INTERMEDIATE',
        'COMPOUND');

INSERT INTO public.exercise_muscle
(exercise_id, muscle_id)
VALUES
    (156, 9);


INSERT INTO public.exercises
(id, "name", description, difficulty, mechanic)
VALUES (157, 'Développé militaire assis à la barre',
        '1. Asseyez-vous sur un banc avec dossier, les pieds bien ancrés au sol, et saisissez la barre légèrement plus large que la largeur des épaules.

2. Positionnez la barre devant le haut de la poitrine, les coudes légèrement sous les poignets et le dos en contact avec le dossier.

3. Poussez la barre vers le haut en tendant les bras, sans hausser excessivement les épaules ni cambrer le bas du dos.

4. Une fois les bras presque tendus, redescendez lentement la barre jusqu''au niveau du haut de la poitrine en contrôlant le mouvement.

5. Répétez le mouvement en maintenant le buste stable et les poignets alignés avec les avant-bras.',
        'INTERMEDIATE',
        'COMPOUND');

INSERT INTO public.exercise_muscle
(exercise_id, muscle_id)
VALUES
    (157, 7),
    (157, 8);


INSERT INTO public.exercises
(id, "name", description, difficulty, mechanic)
VALUES (158, 'Développé militaire debout à la barre, prise large',
        '1. Placez-vous debout, les pieds écartés à la largeur des épaules, et saisissez la barre avec une prise plus large que la largeur des épaules.

2. Positionnez la barre devant le haut de la poitrine, les coudes légèrement sous les poignets et le tronc gainé.

3. Poussez la barre verticalement au-dessus de la tête en tendant les bras, tout en gardant les abdominaux contractés et en évitant de cambrer excessivement le dos.

4. Une fois les bras presque tendus, redescendez lentement la barre jusqu''au niveau du haut de la poitrine en contrôlant le mouvement.

5. Répétez le mouvement en maintenant le corps stable et les poignets alignés avec les avant-bras.',
        'INTERMEDIATE',
        'COMPOUND');

INSERT INTO public.exercise_muscle
(exercise_id, muscle_id)
VALUES
    (158, 7),
    (158, 8);


INSERT INTO public.exercises
(id, "name", description, difficulty, mechanic)
VALUES (159, 'Thruster à la barre',
        '1. Placez la barre sur l''avant des épaules, les pieds écartés à la largeur des épaules et les coudes légèrement relevés.

2. Fléchissez les genoux et les hanches pour descendre en position de squat, en gardant le dos droit et les genoux alignés avec les pieds.

3. Remontez de manière explosive en poussant dans les jambes et utilisez cet élan pour commencer à pousser la barre au-dessus de la tête.

4. Tendez les bras au-dessus de la tête tout en terminant l''extension des hanches et des genoux.

5. Redescendez la barre vers les épaules de manière contrôlée, puis enchaînez directement avec la répétition suivante.',
        'ADVANCED',
        'COMPOUND');

INSERT INTO public.exercise_muscle
(exercise_id, muscle_id)
VALUES
    (159, 7),
    (159, 8);


INSERT INTO public.exercises
(id, "name", description, difficulty, mechanic)
VALUES (160, 'Cordes ondulatoires',
        '1. Placez-vous debout, les pieds écartés à la largeur des épaules, les genoux légèrement fléchis et saisissez une extrémité de la corde dans chaque main.

2. Gardez le dos droit, le tronc gainé et les épaules relâchées tout en maintenant une légère flexion des coudes.

3. Levez rapidement un bras tout en abaissant l''autre afin de créer des ondulations successives dans la corde.

4. Alternez les mouvements des bras à un rythme régulier en utilisant principalement les épaules et les bras, sans effectuer de mouvements excessifs avec le dos.

5. Maintenez une cadence constante pendant toute la durée de l''exercice en gardant le tronc stable.',
        'INTERMEDIATE',
        'COMPOUND');

INSERT INTO public.exercise_muscle
(exercise_id, muscle_id)
VALUES
    (160, 7),
    (160, 8);

INSERT INTO public.exercises
(id, "name", description, difficulty, mechanic)
VALUES (161, 'Élévation latérale à la poulie',
        '1. Placez-vous debout à côté d''une poulie basse et saisissez la poignée avec la main opposée à la poulie.

2. Gardez le dos droit, le bras légèrement fléchi et le coude dans une position stable.

3. Élevez le bras sur le côté jusqu''à environ la hauteur des épaules, en gardant la main et le coude dans un mouvement naturel.

4. Marquez une courte pause en position haute en contractant le deltoïde moyen, puis redescendez lentement le bras en contrôlant la tension du câble.

5. Répétez le mouvement sans utiliser d''élan et en gardant le buste immobile.',
        'BEGINNER',
        'ISOLATION');

INSERT INTO public.exercise_muscle
(exercise_id, muscle_id)
VALUES
    (161, 8);


INSERT INTO public.exercises
(id, "name", description, difficulty, mechanic)
VALUES (162, 'Écarté inversé croisé à la poulie haute',
        '1. Placez-vous debout entre deux poulies hautes et saisissez chaque poignée avec la main opposée au câble, les bras croisés devant vous.

2. Gardez le dos droit, le tronc gainé et les coudes légèrement fléchis pendant toute l''exécution du mouvement.

3. Écartez les bras vers l''extérieur et légèrement vers l''arrière en rapprochant les omoplates, jusqu''à ce que les bras soient alignés avec les épaules.

4. Marquez une courte pause en position ouverte en contractant les deltoïdes postérieurs, puis revenez lentement à la position de départ.

5. Gardez le mouvement contrôlé et évitez d''utiliser l''élan du corps afin de maintenir la tension sur les épaules.',
        'INTERMEDIATE',
        'ISOLATION');

INSERT INTO public.exercise_muscle
(exercise_id, muscle_id)
VALUES
    (162, 9);


INSERT INTO public.exercises
(id, "name", description, difficulty, mechanic)
VALUES (163, 'Élévation en T avec haltères sur banc incliné',
        '1. Allongez-vous à plat ventre sur un banc incliné, un haltère dans chaque main, les bras tendus vers le sol et les paumes face à face.

2. Gardez le buste et la tête stables, les coudes légèrement fléchis et les épaules relâchées.

3. Élevez simultanément les bras sur les côtés jusqu''à former un T avec le corps, en rapprochant légèrement les omoplates.

4. Marquez une courte pause en position haute en contractant les deltoïdes postérieurs, puis redescendez lentement les haltères.

5. Répétez le mouvement de manière contrôlée sans utiliser d''élan ni hausser excessivement les épaules.',
        'BEGINNER',
        'ISOLATION');

INSERT INTO public.exercise_muscle
(exercise_id, muscle_id)
VALUES
    (163, 9);


INSERT INTO public.exercises
(id, "name", description, difficulty, mechanic)
VALUES (164, 'Écarté inversé avec haltères',
        '1. Placez-vous debout, les pieds écartés à la largeur des épaules, et penchez le buste vers l''avant en gardant le dos droit. Tenez un haltère dans chaque main, les bras légèrement fléchis.

2. Laissez les haltères pendre sous la poitrine, les paumes face à face, et gardez les épaules basses.

3. Élevez simultanément les bras sur les côtés jusqu''à les aligner avec les épaules, en dirigeant le mouvement avec les coudes.

4. Marquez une courte pause en position haute en contractant les deltoïdes postérieurs, puis redescendez lentement les haltères.

5. Répétez le mouvement de manière contrôlée sans utiliser d''élan ni hausser les épaules.',
        'BEGINNER',
        'ISOLATION');

INSERT INTO public.exercise_muscle
(exercise_id, muscle_id)
VALUES
    (164, 9);


INSERT INTO public.exercises
(id, "name", description, difficulty, mechanic)
VALUES (165, 'Écarté inversé assis à la machine',
        '1. Asseyez-vous face au dossier de la machine, la poitrine contre le support, et saisissez les poignées avec les bras légèrement fléchis.

2. Gardez le dos droit, le buste stable et les épaules basses pendant toute l''exécution du mouvement.

3. Écartez les bras vers l''arrière jusqu''à les aligner avec les épaules, en dirigeant le mouvement avec les coudes.

4. Marquez une courte pause en position ouverte en contractant les deltoïdes postérieurs, puis revenez lentement à la position de départ.

5. Répétez le mouvement de manière contrôlée sans utiliser d''élan ni hausser les épaules.',
        'BEGINNER',
        'ISOLATION');

INSERT INTO public.exercise_muscle
(exercise_id, muscle_id)
VALUES
    (165, 9);




SELECT setval('exercises_id_seq', (SELECT MAX(id) FROM exercises));
