INSERT INTO public.exercises
(id, "name", description, difficulty, mechanic)
VALUES (181, 'Abdominaux à 3/4',
        '1. Allongez-vous sur le dos, les genoux fléchis et les pieds à plat au sol, avec les mains derrière la tête ou croisées sur la poitrine.

2. Contractez les abdominaux et relevez le haut du corps jusqu''à environ trois quarts de la position assise, sans tirer sur la nuque.

3. Redescendez lentement jusqu''à ce que les épaules se rapprochent du sol, tout en gardant les abdominaux sous tension.

4. Répétez le mouvement de manière contrôlée, en évitant de donner de l''élan avec les bras ou les jambes.',
        'BEGINNER',
        'ISOLATION');

INSERT INTO public.exercise_muscle
(exercise_id, muscle_id)
VALUES
    (181, 18),
    (181, 19);



INSERT INTO public.exercises
(id, "name", description, difficulty, mechanic)
VALUES (182, 'Flexion latérale à 45°',
        '1. Placez-vous debout, le corps incliné à environ 45° sur le côté, en maintenant une position stable et le tronc gainé.

2. Gardez le bassin fixe et effectuez une flexion latérale du tronc en rapprochant le côté du buste de la hanche.

3. Revenez lentement à la position de départ en contrôlant le mouvement, sans utiliser d''élan.

4. Effectuez toutes les répétitions d''un côté avant de changer de côté, en gardant le mouvement fluide et maîtrisé.',
        'INTERMEDIATE',
        'ISOLATION');

INSERT INTO public.exercise_muscle
(exercise_id, muscle_id)
VALUES
    (182, 20),
    (182, 21);


INSERT INTO public.exercises
(id, "name", description, difficulty, mechanic)
VALUES (183, 'Toucher alterné des talons',
        '1. Allongez-vous sur le dos, les genoux fléchis et les pieds à plat au sol, légèrement écartés de la largeur des épaules.

2. Décollez légèrement les épaules du sol et gardez les abdominaux contractés.

3. Inclinez le buste sur le côté pour toucher votre talon droit avec la main droite.

4. Revenez au centre, puis inclinez le buste de l''autre côté pour toucher le talon gauche avec la main gauche.

5. Alternez les côtés à chaque répétition en gardant les mouvements contrôlés et les lombaires proches du sol.',
        'BEGINNER',
        'ISOLATION');

INSERT INTO public.exercise_muscle
(exercise_id, muscle_id)
VALUES
    (183, 18),
    (183, 20);


INSERT INTO public.exercises
(id, "name", description, difficulty, mechanic)
VALUES (184, 'Déroulé à la roue abdominale debout',
        '1. Placez-vous debout, les pieds écartés à la largeur des épaules, et saisissez fermement les poignées de la roue abdominale.

2. Gardez les bras tendus, les abdominaux fortement contractés et le bassin légèrement rentré.

3. Faites rouler la roue vers l''avant en inclinant progressivement le corps, tout en contrôlant la descente et en gardant le dos aligné.

4. Descendez jusqu''à l''amplitude que vous pouvez maîtriser sans creuser le bas du dos.

5. Contractez fortement les abdominaux et ramenez la roue vers vous pour revenir à la position de départ, sans utiliser d''élan.',
        'ADVANCED',
        'COMPOUND');

INSERT INTO public.exercise_muscle
(exercise_id, muscle_id)
VALUES
    (184, 18),
    (184, 19),
    (184, 21);

INSERT INTO public.exercises
(id, "name", description, difficulty, mechanic)
VALUES (185, 'Déroulé à la roue abdominale à genoux',
        '1. Agenouillez-vous au sol, saisissez fermement les poignées de la roue abdominale et placez-la devant vous.

2. Contractez les abdominaux, rentrez légèrement le bassin et gardez le dos aligné.

3. Faites rouler la roue vers l''avant en tendant progressivement les bras et en contrôlant l''extension du corps, sans creuser le bas du dos.

4. Descendez jusqu''à l''amplitude que vous pouvez maîtriser tout en maintenant les abdominaux sous tension.

5. Contractez fortement les abdominaux et ramenez la roue vers vous pour revenir à la position de départ, sans utiliser d''élan.',
        'INTERMEDIATE',
        'COMPOUND');

INSERT INTO public.exercise_muscle
(exercise_id, muscle_id)
VALUES
    (185, 18),
    (185, 19),
    (185, 21);

INSERT INTO public.exercises
(id, "name", description, difficulty, mechanic)
VALUES (186, 'Développé assis sur machine à levier',
        '1. Asseyez-vous sur la machine, le dos bien plaqué contre le dossier et les pieds fermement posés au sol.

2. Saisissez les poignées avec une prise adaptée à la machine, les coudes légèrement sous ou dans l''alignement des épaules.

3. Poussez les poignées vers l''avant en contractant les pectoraux, sans décoller le dos du dossier.

4. Tendez les bras sans verrouiller brutalement les coudes, puis ramenez lentement les poignées vers vous en contrôlant la charge.

5. Gardez les épaules basses et le mouvement fluide afin de maintenir une tension constante sur les pectoraux.',
        'BEGINNER',
        'COMPOUND');

INSERT INTO public.exercise_muscle
(exercise_id, muscle_id)
VALUES (186, 1);


INSERT INTO public.exercises
(id, "name", description, difficulty, mechanic)
VALUES (187, 'Crunch décliné',
        '1. Allongez-vous sur un banc décliné, les pieds fermement maintenus et les genoux légèrement fléchis.

2. Placez les mains derrière la tête ou croisées sur la poitrine, puis contractez les abdominaux pour stabiliser le bassin.

3. Enroulez progressivement le haut du dos en rapprochant la cage thoracique du bassin, sans tirer sur la nuque.

4. Marquez une courte pause en position haute en contractant les abdominaux, puis redescendez lentement en contrôlant le mouvement.

5. Gardez le bas du dos en contact avec le banc et évitez de donner de l''élan avec les bras ou les jambes.',
        'INTERMEDIATE',
        'ISOLATION');

INSERT INTO public.exercise_muscle
(exercise_id, muscle_id)
VALUES (187, 18);

INSERT INTO public.exercises
(id, "name", description, difficulty, mechanic)
VALUES (188, 'Drapeau',
        '1. Placez-vous allongé sur le côté d''un support vertical solide et saisissez-le fermement avec les deux mains.

2. Engagez fortement les abdominaux et les obliques afin de maintenir le corps gainé et aligné.

3. Poussez avec le bras inférieur tout en tirant avec le bras supérieur pour soulever les jambes et le bassin du sol.

4. Maintenez le corps aussi droit que possible à l''horizontale, sans laisser les hanches s''affaisser.

5. Redescendez lentement et sous contrôle, puis répétez le mouvement en conservant une forte contraction de la sangle abdominale.',
        'ADVANCED',
        'ISOLATION');

INSERT INTO public.exercise_muscle
(exercise_id, muscle_id)
VALUES
    (188, 18),
    (188, 19),
    (188, 20),
    (188, 21);

INSERT INTO public.exercises
(id, "name", description, difficulty, mechanic)
VALUES (189, 'Coude-genou',
        '1. Allongez-vous sur le dos, les genoux fléchis et les pieds posés au sol. Placez les mains derrière la tête sans tirer sur la nuque.

2. Contractez les abdominaux et décollez légèrement les épaules du sol.

3. Ramenez un coude vers le genou opposé en effectuant une légère rotation du buste.

4. Revenez lentement à la position initiale, puis effectuez le mouvement de l''autre côté.

5. Alternez les côtés en gardant les abdominaux contractés et en contrôlant chaque répétition.',
        'BEGINNER',
        'ISOLATION');

INSERT INTO public.exercise_muscle
(exercise_id, muscle_id)
VALUES
    (189, 18),
    (189, 20);

INSERT INTO public.exercises
(id, "name", description, difficulty, mechanic)
VALUES (190, 'Front lever',
        '1. Suspendez-vous à une barre fixe avec une prise pronation, les bras tendus et les épaules engagées.

2. Contractez fortement les abdominaux, les fessiers et les jambes afin de maintenir le corps parfaitement gainé.

3. Tirez les épaules vers le bas et vers l''arrière, puis amenez progressivement le corps à l''horizontale en gardant les bras tendus.

4. Maintenez la position avec le corps aligné, sans laisser les hanches s''affaisser ni plier les coudes.

5. Redescendez lentement sous contrôle ou relâchez progressivement la position, puis répétez.',
        'ADVANCED',
        'ISOLATION');

INSERT INTO public.exercise_muscle
(exercise_id, muscle_id)
VALUES
    (190, 18),
    (190, 19),
    (190, 20),
    (190, 21);

INSERT INTO public.exercises
(id, "name", description, difficulty, mechanic)
VALUES (191, 'Planche complète',
        '1. Placez les mains au sol, légèrement plus écartées que la largeur des épaules, les doigts orientés vers l''avant.

2. Tendez complètement les bras et inclinez progressivement les épaules vers l''avant afin de transférer le poids du corps au-dessus des mains.

3. Décollez les pieds du sol et maintenez les jambes tendues, en gardant le corps parfaitement aligné de la tête aux pieds.

4. Contractez fortement les abdominaux, les fessiers et les jambes pour éviter que les hanches ne s''affaissent.

5. Maintenez la position aussi longtemps que possible avec les bras tendus, puis redescendez progressivement sous contrôle.',
        'ADVANCED',
        'ISOLATION');

INSERT INTO public.exercise_muscle
(exercise_id, muscle_id)
VALUES
    (191, 18),
    (191, 19),
    (191, 20),
    (191, 21);

INSERT INTO public.exercises
(id, "name", description, difficulty, mechanic)
VALUES (192, 'Relevé de hanches et de jambes suspendu',
        '1. Suspendez-vous à une barre fixe avec une prise pronation, les bras tendus et les jambes jointes.

2. Engagez les abdominaux et gardez les jambes tendues pendant toute l''exécution du mouvement.

3. Relevez les jambes vers l''avant en enroulant progressivement le bassin afin de rapprocher les hanches de la poitrine.

4. Montez aussi haut que possible en contractant fortement les abdominaux, sans utiliser d''élan.

5. Redescendez lentement les jambes jusqu''à la position initiale en gardant le mouvement contrôlé.',
        'INTERMEDIATE',
        'ISOLATION');

INSERT INTO public.exercise_muscle
(exercise_id, muscle_id)
VALUES
    (192, 18),
    (192, 19),
    (192, 21);

INSERT INTO public.exercises
(id, "name", description, difficulty, mechanic)
VALUES (193, 'Relevé de genoux oblique suspendu',
        '1. Suspendez-vous à une barre fixe avec une prise pronation, les bras tendus et les jambes jointes.

2. Contractez les abdominaux et gardez le haut du corps stable pendant toute l''exécution du mouvement.

3. Relevez les genoux vers la poitrine tout en les dirigeant vers un côté afin d''effectuer une rotation du bassin.

4. Montez aussi haut que possible en contractant les abdominaux et les obliques, sans utiliser d''élan.

5. Redescendez lentement les jambes, puis effectuez le mouvement du côté opposé en alternant les côtés à chaque répétition.',
        'INTERMEDIATE',
        'ISOLATION');

INSERT INTO public.exercise_muscle
(exercise_id, muscle_id)
VALUES
    (193, 18),
    (193, 19),
    (193, 20),
    (193, 21);


INSERT INTO public.exercises
(id, "name", description, difficulty, mechanic)
VALUES (194, 'Pike suspendu',
        '1. Suspendez-vous à une barre fixe avec les bras tendus et le corps gainé.

2. Contractez les abdominaux et relevez simultanément les jambes et le bassin vers l''avant afin d''amener les pieds vers la barre.

3. Montez les jambes aussi haut que possible en gardant les jambes tendues et en contrôlant le mouvement, sans vous balancer.

4. Redescendez lentement jusqu''à la position initiale en maintenant le gainage, puis répétez.',
        'ADVANCED',
        'ISOLATION');

INSERT INTO public.exercise_muscle
(exercise_id, muscle_id)
VALUES
    (194, 18),
    (194, 19),
    (194, 21);

INSERT INTO public.exercises
(id, "name", description, difficulty, mechanic)
VALUES (195, 'Relevé de jambes tendues suspendu',
        '1. Suspendez-vous à une barre fixe avec les bras tendus, les jambes jointes et le corps gainé.

2. Contractez les abdominaux puis relevez les jambes tendues vers l''avant en gardant les genoux verrouillés et en évitant de vous balancer.

3. Montez les jambes jusqu''à atteindre une position aussi haute que possible tout en gardant le mouvement contrôlé.

4. Redescendez lentement les jambes jusqu''à la position initiale sans relâcher complètement le gainage, puis répétez.',
        'INTERMEDIATE',
        'ISOLATION');

INSERT INTO public.exercise_muscle
(exercise_id, muscle_id)
VALUES
    (195, 18),
    (195, 19),
    (195, 21);


INSERT INTO public.exercises
(id, "name", description, difficulty, mechanic)
VALUES (196, 'Sit-up jackknife',
        '1. Allongez-vous sur le dos, les jambes tendues et les bras tendus derrière la tête.

2. Contractez les abdominaux pour relever simultanément le haut du corps et les jambes vers le centre du corps.

3. Amenez les mains vers les pieds en gardant les jambes aussi tendues que possible, puis contrôlez la descente.

4. Revenez lentement à la position initiale sans relâcher complètement les abdominaux, puis répétez.',
        'INTERMEDIATE',
        'COMPOUND');

INSERT INTO public.exercise_muscle
(exercise_id, muscle_id)
VALUES
    (196, 18),
    (196, 19),
    (196, 21);


INSERT INTO public.exercises
(id, "name", description, difficulty, mechanic)
VALUES (197, 'Planche penchée',
        '1. Placez-vous en position de planche, les mains au sol légèrement en avant des épaules et les bras tendus.

2. Contractez fortement les abdominaux, les fessiers et les jambes afin de maintenir le corps parfaitement gainé et aligné.

3. Projetez progressivement les épaules vers l''avant au-delà des mains en gardant les bras tendus et les coudes verrouillés.

4. Maintenez la position en contrôlant la tension sur les épaules et le tronc, sans creuser le bas du dos.

5. Revenez progressivement à la position initiale en conservant le gainage.',
        'ADVANCED',
        'COMPOUND');

INSERT INTO public.exercise_muscle
(exercise_id, muscle_id)
VALUES
    (197, 18),
    (197, 19),
    (197, 21);

INSERT INTO public.exercises
(id, "name", description, difficulty, mechanic)
VALUES (198, 'Frappe au marteau de forgeron',
        '1. Placez-vous debout face à un pneu ou une surface adaptée, les pieds écartés à la largeur des épaules, en tenant le marteau à deux mains.

2. Levez le marteau au-dessus d''une épaule en gardant le tronc gainé et les genoux légèrement fléchis.

3. Frappez puissamment vers le bas en utilisant principalement la rotation du tronc et l''extension des bras.

4. Contrôlez le rebond ou l''impact du marteau, puis ramenez-le au-dessus de l''épaule opposée.

5. Alternez les côtés à chaque répétition en maintenant une posture stable et un mouvement contrôlé.',
        'INTERMEDIATE',
        'COMPOUND');

INSERT INTO public.exercise_muscle
(exercise_id, muscle_id)
VALUES
    (198, 20),
    (198, 23),
    (198, 24);






SELECT setval('exercises_id_seq', (SELECT MAX(id) FROM exercises));
