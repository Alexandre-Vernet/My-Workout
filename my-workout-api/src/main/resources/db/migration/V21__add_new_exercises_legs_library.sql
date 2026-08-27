INSERT INTO public.exercises
(id, "name", description, difficulty, mechanic)
VALUES (166, 'Épaulé-jeté à la barre',
        '1. Placez la barre au sol devant vous, les pieds écartés à la largeur des épaules, puis saisissez-la avec une prise légèrement plus large que les épaules.

2. Gardez le dos droit et le tronc gainé, puis poussez dans les jambes pour décoller la barre du sol en la gardant proche du corps.

3. Effectuez une extension explosive des hanches et des genoux pour amener la barre sur l''avant des épaules, puis réceptionnez-la en fléchissant légèrement les genoux.

4. Depuis cette position, poussez fortement dans les jambes pour propulser la barre au-dessus de la tête tout en tendant les bras.

5. Stabilisez la barre au-dessus de la tête, puis redescendez-la de manière contrôlée avant de recommencer la répétition.',
        'ADVANCED',
        'COMPOUND');

INSERT INTO public.exercise_muscle
(exercise_id, muscle_id)
VALUES
    (166, 3),
    (166, 4),
    (166, 5),
    (166, 6);


INSERT INTO public.exercises
(id, "name", description, difficulty, mechanic)
VALUES (167, 'Soulevé de terre à la barre',
        '1. Placez la barre au sol devant vous, les pieds écartés à la largeur des hanches, puis saisissez-la avec les mains juste à l’extérieur des jambes.

2. Fléchissez légèrement les genoux et poussez les hanches vers l’arrière en gardant le dos droit et le tronc gainé.

3. Poussez dans les pieds et tendez les hanches et les genoux pour soulever la barre en la gardant proche du corps.

4. Une fois debout, terminez l’extension des hanches sans vous pencher excessivement vers l’arrière.

5. Repoussez les hanches vers l’arrière et fléchissez les genoux pour redescendre la barre au sol de manière contrôlée, en maintenant le dos droit.',
        'INTERMEDIATE',
        'COMPOUND');

INSERT INTO public.exercise_muscle
(exercise_id, muscle_id)
VALUES
    (167, 3),
    (167, 4),
    (167, 5),
    (167, 6);

INSERT INTO public.exercises
(id, "name", description, difficulty, mechanic)
VALUES (168, 'Squat avant à la barre',
        '1. Placez la barre sur l''avant des épaules, les coudes relevés et les mains positionnées légèrement plus larges que les épaules.

2. Placez les pieds environ à la largeur des épaules, gainez le tronc et gardez le dos droit.

3. Fléchissez les hanches et les genoux pour descendre en squat, en gardant les coudes hauts et les genoux alignés avec les pieds.

4. Descendez jusqu''à une profondeur confortable en maintenant le buste aussi droit que possible.

5. Poussez dans les pieds pour remonter en tendant les genoux et les hanches, puis répétez le mouvement de manière contrôlée.',
        'INTERMEDIATE',
        'COMPOUND');

INSERT INTO public.exercise_muscle
(exercise_id, muscle_id)
VALUES
    (168, 3),
    (168, 5),
    (168, 32);

INSERT INTO public.exercises
(id, "name", description, difficulty, mechanic)
VALUES (169, 'Hip thrust à la barre',
        '1. Asseyez-vous au sol devant un banc, le haut du dos contre le bord du banc, les genoux fléchis et les pieds à plat sur le sol.

2. Placez une barre rembourrée sur les hanches et maintenez-la avec les mains pour éviter qu''elle ne glisse.

3. Contractez les abdominaux et poussez dans les pieds pour soulever les hanches jusqu''à ce que le buste et les cuisses soient alignés.

4. Marquez une courte pause en position haute en contractant fortement les fessiers, sans cambrer excessivement le bas du dos.

5. Redescendez lentement les hanches jusqu''à la position de départ, puis répétez le mouvement de manière contrôlée.',
        'INTERMEDIATE',
        'COMPOUND');

INSERT INTO public.exercise_muscle
(exercise_id, muscle_id)
VALUES
    (169, 3),
    (169, 4),
    (169, 5);


INSERT INTO public.exercises
(id, "name", description, difficulty, mechanic)
VALUES (170, 'Leg curl allongé à la machine',
        '1. Allongez-vous à plat ventre sur la machine, les chevilles placées sous les rouleaux et les jambes tendues.

2. Gardez les hanches et le buste bien en contact avec le support, les mains sur les poignées et les jambes parallèles.

3. Fléchissez les genoux pour ramener les rouleaux vers les fessiers en contractant les ischio-jambiers, sans décoller les hanches du support.

4. Marquez une courte pause en position haute, puis redescendez lentement les jambes en contrôlant la charge.

5. Répétez le mouvement sans utiliser d''élan et en maintenant une tension constante sur les ischio-jambiers.',
        'BEGINNER',
        'ISOLATION');

INSERT INTO public.exercise_muscle
(exercise_id, muscle_id)
VALUES
    (170, 4),
    (170, 6);


INSERT INTO public.exercises
(id, "name", description, difficulty, mechanic)
VALUES (171, 'Extension des mollets assis à la machine',
        '1. Asseyez-vous sur la machine, placez l''avant des pieds sur la plateforme et positionnez les coussins sur le bas des cuisses, juste au-dessus des genoux.

2. Gardez les genoux fixes et saisissez les poignées de la machine pour stabiliser le haut du corps.

3. Poussez sur l''avant des pieds pour élever les talons aussi haut que possible en contractant les mollets.

4. Marquez une courte pause en position haute, puis abaissez lentement les talons pour étirer les mollets.

5. Répétez le mouvement de manière contrôlée en conservant une amplitude complète.',
        'BEGINNER',
        'ISOLATION');

INSERT INTO public.exercise_muscle
(exercise_id, muscle_id)
VALUES
    (171, 31);

INSERT INTO public.exercises
(id, "name", description, difficulty, mechanic)
VALUES (172, 'Extension des mollets debout à la machine',
        '1. Placez-vous debout sur la plateforme de la machine, les épaules sous les coussinets et les pieds parallèles, avec les talons dans le vide.

2. Gardez les jambes tendues sans verrouiller excessivement les genoux et maintenez le dos droit pendant toute l''exécution.

3. Descendez lentement les talons vers le bas afin d''étirer les mollets tout en contrôlant la charge.

4. Poussez sur l''avant des pieds pour élever les talons le plus haut possible en contractant les mollets.

5. Redescendez progressivement et répétez le mouvement sans utiliser d''élan.',
        'BEGINNER',
        'ISOLATION');

INSERT INTO public.exercise_muscle
(exercise_id, muscle_id)
VALUES
    (172, 6),
    (172, 31);


INSERT INTO public.exercises
(id, "name", description, difficulty, mechanic)
VALUES (173, 'Extension de hanche penché à l’élastique',
        '1. Fixez l''élastique derrière vous à un point bas et placez l''autre extrémité autour de vos hanches. Reculez pour créer une tension dans l''élastique.

2. Penchez le buste vers l''avant en gardant le dos droit et les genoux légèrement fléchis.

3. Poussez les hanches vers l''avant en contractant les fessiers jusqu''à revenir en position debout, sans cambrer excessivement le bas du dos.

4. Revenez lentement à la position de départ en laissant les hanches reculer tout en contrôlant la tension de l''élastique.

5. Gardez le mouvement centré sur les hanches et maintenez le dos stable pendant toute l''exécution.',
        'BEGINNER',
        'ISOLATION');

INSERT INTO public.exercise_muscle
(exercise_id, muscle_id)
VALUES
    (173, 5),
    (173, 4);

INSERT INTO public.exercises
(id, "name", description, difficulty, mechanic)
VALUES (174, 'Extension de hanche debout à la poulie',
        '1. Fixez la sangle de la poulie basse autour d''une cheville et placez-vous face à la machine en vous tenant à un support pour garder l''équilibre.

2. Gardez le buste droit, la jambe d''appui légèrement fléchie et les abdominaux gainés.

3. Amenez la jambe équipée de la sangle vers l''arrière en contractant le fessier, sans cambrer le bas du dos ni tourner le bassin.

4. Revenez lentement à la position de départ en contrôlant la charge et en gardant la tension sur le câble.

5. Effectuez toutes les répétitions avec une amplitude contrôlée, puis changez de jambe.',
        'BEGINNER',
        'ISOLATION');

INSERT INTO public.exercise_muscle
(exercise_id, muscle_id)
VALUES
    (174, 5);

INSERT INTO public.exercises
(id, "name", description, difficulty, mechanic)
VALUES (175, 'Retourner de pneu',
        '1. Placez-vous face au pneu, les pieds écartés à la largeur des épaules et les genoux légèrement fléchis.

2. Accroupissez-vous et saisissez le bord inférieur du pneu avec les mains, en gardant le dos droit et la poitrine relevée.

3. Poussez fortement dans les jambes tout en tirant le pneu vers vous afin de le faire basculer.

4. Lorsque le pneu commence à monter, avancez les hanches et les épaules pour poursuivre le mouvement et amenez un genou contre le pneu si nécessaire.

5. Saisissez le haut du pneu et poussez-le vers l''avant avec les bras jusqu''à le faire complètement basculer.

6. Laissez le pneu retomber de manière contrôlée, puis repositionnez-vous pour la répétition suivante.',
        'ADVANCED',
        'COMPOUND');

INSERT INTO public.exercise_muscle
(exercise_id, muscle_id)
VALUES
    (175, 3),
    (175, 4),
    (175, 5);





SELECT setval('exercises_id_seq', (SELECT MAX(id) FROM exercises));
