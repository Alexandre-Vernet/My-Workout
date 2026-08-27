TRUNCATE TABLE exercise_muscle, history, workout, user_exercise, muscles, exercises, muscle_group, users RESTART IDENTITY CASCADE;

INSERT INTO public.users VALUES (1, 'user1@gmail.com', '$2a$10$Z8K1uTlewFkZj6ZJ35Fn9uk1BvvL8VT4GKSbvyvOFPp89SJD3A/bq', '2025-04-14 00:00:00', '2025-04-14 00:00:00', false);
INSERT INTO public.users VALUES (2, 'user2@gmail.com', '$2a$10$7Rx02KaSETCRAFZet.ZsbufTUWdJauq5GeVb.TN.aoONQUUsSlCSa', '2025-04-14 00:00:00', '2025-04-14 00:00:00', false);
INSERT INTO public.users VALUES (3, 'admin@gmail.com', '$2a$10$7Rx02KaSETCRAFZet.ZsbufTUWdJauq5GeVb.TN.aoONQUUsSlCSa', '2025-04-14 00:00:00', '2025-04-14 00:00:00', true);


INSERT INTO public.exercises (id,name,description,difficulty,mechanic) VALUES
                                                                           (101,'Curl pupitre machine','1. Ajustez la hauteur du siège de la machine afin que vos aisselles reposent confortablement contre le haut du pupitre, puis asseyez-vous en plaçant l''arrière de vos bras bien à plat sur le support.

2. Saisissez les poignées avec une prise en supination (paumes vers le haut), les bras tendus mais sans verrouiller complètement les coudes.

3. Tirez les poignées vers le haut en fléchissant les coudes et en contractant les biceps, tout en veillant à ce que vos bras et vos aisselles restent bien calés contre le pupitre.

4. Marquez un court temps d''arrêt en position haute pour accentuer la contraction des biceps.

5. Redescendez lentement la charge de manière contrôlée jusqu''à l''extension presque complète des bras, afin de maintenir une tension continue sur le muscle.

6. Répétez le mouvement en évitant de décoller les coudes du support ou de donner de l''élan avec le buste.','INTERMEDIATE','COMPOUND'),
                                                                           (16,'Tractions prise large','1. Saisissez la barre de traction avec une prise large, les mains plus écartées que la largeur des épaules, puis suspendez-vous avec les bras tendus.

2. Gardez le buste légèrement incliné vers l''arrière, la poitrine sortie et les épaules basses afin de préparer le mouvement.

3. Tirez votre corps vers la barre en ramenant les coudes vers le bas et vers l''arrière jusqu''à ce que votre menton dépasse la barre.

4. Marquez un léger temps d''arrêt en position haute en contractant les muscles du dos, tout en conservant le contrôle.

5. Redescendez lentement jusqu''à l''extension complète des bras sans relâcher brutalement la tension.

6. Répétez le mouvement en évitant de donner de l''élan avec les jambes afin de maximiser le travail des dorsaux.','INTERMEDIATE','COMPOUND'),
                                                                           (33,'Fentes barre','1. Placez-vous debout avec une barre positionnée sur le haut du dos, les pieds écartés à la largeur des épaules et le dos droit.

2. Gardez les abdominaux contractés et avancez une jambe devant vous en conservant une position stable.

3. Descendez lentement en fléchissant les deux genoux jusqu''à ce que le genou arrière se rapproche du sol.

4. Marquez un léger temps d''arrêt en position basse tout en gardant le genou avant aligné avec la pointe du pied.

5. Poussez dans le pied avant pour revenir à la position de départ en contractant les quadriceps et les fessiers.

6. Répétez le mouvement en alternant les jambes et en conservant une posture stable afin de maximiser le travail des jambes.','INTERMEDIATE','COMPOUND'),
                                                                           (35,'Développé couché barre','1. Allongez-vous sur un banc plat, les pieds bien à plat au sol et les omoplates légèrement serrées afin de créer une position stable.

2. Saisissez la barre avec une prise légèrement plus large que les épaules, puis décrochez-la du support en gardant les bras tendus au-dessus de votre poitrine.

3. Descendez lentement la barre vers le milieu de votre poitrine en fléchissant les coudes, tout en gardant les épaules basses et le contrôle de la charge.

4. Marquez un léger temps d''arrêt en bas du mouvement tout en conservant la tension dans les pectoraux.

5. Poussez la barre vers le haut en contractant les pectoraux jusqu''à l''extension presque complète des bras, sans verrouiller brutalement les coudes.

6. Répétez le mouvement en gardant une trajectoire stable et en évitant de décoller les épaules du banc afin de maximiser le travail des pectoraux.','INTERMEDIATE','COMPOUND'),
                                                                           (105,'Curl à la poulie','1. Placez-vous debout face à une poulie basse, les pieds écartés à la largeur des épaules, et saisissez la barre avec une prise en supination (paumes vers le haut).

2. Reculez d''un pas pour mettre le câble sous tension, gardez le buste droit, les épaules en arrière et les coudes serrés le long du corps.

3. Fléchissez les bras pour monter la barre vers vos épaules en contractant fermement vos biceps, tout en gardant les coudes parfaitement immobiles.

4. Marquez un court temps d''arrêt en position haute afin d''accentuer la contraction des biceps sous la tension continue du câble.

5. Redescendez lentement la barre en contrôlant le mouvement jusqu''à l''extension presque complète des bras, sans relâcher la tension.

6. Répétez le mouvement en veillant à ne pas utiliser le balancement du buste ou l''élan pour soulever la charge.','BEGINNER','ISOLATION'),
                                                                           (40,'Développé incliné machine convergente','1. Réglez le siège de la machine afin que les poignées soient alignées avec le haut de votre poitrine, puis asseyez-vous avec les pieds bien à plat au sol.

2. Saisissez les poignées avec une prise légèrement plus large que les épaules, gardez le dos plaqué contre le dossier et les omoplates serrées.

3. Poussez les poignées vers l''avant et vers le haut en tendant les bras, tout en conservant une trajectoire naturelle et contrôlée.

4. Marquez un léger temps d''arrêt en position haute en contractant les pectoraux, sans verrouiller brutalement les coudes.

5. Revenez lentement à la position de départ en contrôlant la descente jusqu''à ressentir un étirement des pectoraux.

6. Répétez le mouvement en gardant les épaules basses et en évitant de décoller le dos du dossier afin de maximiser le travail du haut des pectoraux.','INTERMEDIATE','COMPOUND'),
                                                                           (45,'Hack squat','1. Placez-vous dans la machine hack squat, le dos et les épaules bien positionnés contre les supports, puis placez vos pieds sur la plateforme avec un écartement adapté.

2. Gardez les abdominaux contractés, le dos plaqué contre le dossier et déverrouillez la sécurité.

3. Descendez lentement en fléchissant les genoux et les hanches jusqu''à atteindre une amplitude confortable tout en gardant les pieds bien ancrés.

4. Marquez un léger temps d''arrêt en position basse en conservant le contrôle de la charge.

5. Poussez dans vos pieds pour remonter jusqu''à la position de départ sans verrouiller brutalement les genoux.

6. Répétez le mouvement en gardant les genoux alignés avec les pointes de pieds afin de maximiser le travail des quadriceps et des fessiers.','INTERMEDIATE','COMPOUND'),
                                                                           (38,'Écartés couché haltères','1. Allongez-vous sur un banc plat, les pieds bien à plat au sol et un haltère dans chaque main au-dessus de votre poitrine.

2. Gardez les bras légèrement fléchis et les omoplates serrées afin de maintenir une position stable.

3. Écartez lentement les haltères sur les côtés en effectuant un mouvement d''arc jusqu''à ressentir un étirement des pectoraux.

4. Marquez un léger temps d''arrêt en position basse tout en conservant le contrôle de la charge.

5. Ramenez les haltères vers la position de départ en contractant les pectoraux, sans modifier l''angle des coudes.

6. Répétez le mouvement en gardant une amplitude contrôlée et en évitant de trop descendre les haltères afin de protéger les épaules.','INTERMEDIATE','ISOLATION'),
                                                                           (102,'Chest press','1. Asseyez-vous confortablement sur la machine, le dos bien à plat contre le dossier, les pieds ancrés au sol, et ajustez la hauteur du siège pour que les poignées soient alignées avec le milieu de votre poitrine.

2. Saisissez les poignées avec une prise ferme, les coudes fléchis et orientés légèrement vers le bas afin de protéger vos articulations.

3. Poussez les poignées vers l''avant en expirant et en contractant les pectoraux, jusqu''à ce que vos bras soient presque tendus, sans verrouiller les coudes.

4. Marquez un court temps d''arrêt en position de contraction maximale, tout en gardant les épaules basses et la poitrine sortie.

5. Ramenez lentement et sous contrôle les poignées vers la position de départ, jusqu''à ressentir un étirement confortable au niveau de la poitrine, sans laisser la charge reposer complètement.

6. Répétez le mouvement en maintenant une trajectoire fluide et continue, en évitant de décoller le dos du dossier.','INTERMEDIATE','COMPOUND'),
                                                                           (47,'Fentes haltères','1. Placez-vous debout avec un haltère dans chaque main, les bras le long du corps et les pieds écartés à la largeur des hanches.

2. Gardez le dos droit, les abdominaux contractés puis avancez une jambe devant vous.

3. Descendez lentement en fléchissant les deux genoux jusqu''à ce que le genou arrière se rapproche du sol, tout en gardant le genou avant aligné avec le pied.

4. Marquez un léger temps d''arrêt en position basse en conservant le contrôle de la charge.

5. Poussez dans le pied avant pour revenir à la position de départ en contractant les quadriceps et les fessiers.

6. Répétez le mouvement en alternant les jambes tout en gardant une posture stable.','INTERMEDIATE','COMPOUND');
INSERT INTO public.exercises (id,name,description,difficulty,mechanic) VALUES
                                                                           (48,'Squat bulgare','1. Placez-vous debout devant un banc, un pied posé derrière vous sur le support et un haltère dans chaque main.

2. Gardez le buste légèrement incliné vers l''avant, le dos droit et la jambe avant bien ancrée au sol.

3. Descendez lentement en fléchissant la jambe avant jusqu''à ce que le genou arrière se rapproche du sol.

4. Marquez un léger temps d''arrêt en position basse tout en conservant le contrôle du mouvement.

5. Poussez dans le pied avant pour remonter en contractant les quadriceps et les fessiers.

6. Répétez le mouvement de chaque côté en gardant le genou aligné avec la pointe du pied.','INTERMEDIATE','COMPOUND'),
                                                                           (57,'Rowing haltères','1. Placez un genou et une main sur un banc afin de stabiliser votre position, puis saisissez un haltère avec l''autre main.

2. Gardez le dos droit, la poitrine sortie et le bras tendu vers le sol en position de départ.

3. Tirez l''haltère vers votre bassin en ramenant le coude vers l''arrière tout en gardant l''épaule basse.

4. Marquez un léger temps d''arrêt en position haute en contractant les muscles du dos.

5. Redescendez lentement l''haltère jusqu''à l''extension complète du bras en contrôlant la charge.

6. Répétez le mouvement de chaque côté en évitant de tourner le buste afin de maximiser le travail du dos.','INTERMEDIATE','COMPOUND'),
                                                                           (54,'Oiseau','1. Placez-vous assis ou debout avec un haltère dans chaque main, le buste légèrement incliné vers l''avant et le dos droit.

2. Gardez les bras légèrement fléchis et les épaules basses afin de préparer le mouvement.

3. Écartez lentement les bras sur les côtés en effectuant un mouvement d''arc jusqu''à aligner les mains avec les épaules.

4. Marquez un léger temps d''arrêt en position haute en contractant les deltoïdes postérieurs.

5. Redescendez lentement les haltères jusqu''à la position de départ en contrôlant la charge.

6. Répétez le mouvement en évitant de tirer avec le dos afin de maximiser le travail de l''arrière des épaules.','INTERMEDIATE','COMPOUND'),
                                                                           (103,'Développé incliné barre','1. Allongez-vous sur un banc incliné (entre 30 et 45 degrés), les pieds bien à plat au sol pour assurer votre stabilité et les omoplates serrées contre le dossier.

2. Saisissez la barre avec une prise en pronation (paumes vers l''avant) légèrement plus large que la largeur des épaules, puis décrochez-la pour la positionner bras tendus au-dessus du haut de votre poitrine.

3. Descendez lentement et de manière contrôlée la barre jusqu''à ce qu''elle effleure le haut de votre poitrine en gardant les coudes légèrement orientés vers l''intérieur.

4. Marquez un très court temps d''arrêt en position basse sans relâcher la tension et sans faire rebondir la barre sur la poitrine.

5. Poussez la barre vers le haut en contractant les pectoraux jusqu''à l''extension presque complète des bras, sans verrouiller brutalement les coudes en fin de mouvement.

6. Répétez le mouvement en maintenant une trajectoire stable et contrôlée, en veillant à garder les épaules basses et bien plaquées contre le banc.','INTERMEDIATE','COMPOUND'),
                                                                           (90,'Pompe classique','1. Placez-vous en position de pompe avec les mains légèrement plus larges que les épaules et les pieds en appui au sol.

2. Gardez le corps aligné de la tête aux talons, les abdominaux contractés et les fessiers légèrement engagés.

3. Descendez lentement la poitrine vers le sol en fléchissant les coudes tout en gardant le contrôle du mouvement.

4. Marquez un léger temps d''arrêt en position basse sans perdre la tension musculaire.

5. Poussez dans vos mains pour revenir à la position de départ en contractant les pectoraux et les triceps.

6. Répétez le mouvement en évitant de creuser le bas du dos ou d''écarter excessivement les coudes.','INTERMEDIATE','COMPOUND'),
                                                                           (155,'Pompes sur les avant-bras','1. Placez-vous en position de planche sur les avant-bras, les coudes sous les épaules et les avant-bras posés au sol.

2. Gardez le corps aligné de la tête aux pieds en contractant les abdominaux et les fessiers.

3. Fléchissez les coudes pour abaisser le corps de manière contrôlée, en gardant les coudes proches du corps.

4. Poussez sur les avant-bras pour ramener le corps à la position de départ en contractant les triceps.

5. Répétez le mouvement sans laisser les hanches s''affaisser ni utiliser d''élan.','BEGINNER','COMPOUND'),
                                                                           (88,'Développé couché prise serrée à la barre','1. Allongez-vous sur un banc plat, les pieds bien à plat au sol et les omoplates légèrement serrées.

2. Saisissez la barre avec une prise serrée, environ à la largeur des épaules, puis positionnez-la au-dessus de votre poitrine.

3. Descendez lentement la barre vers le bas de la poitrine en gardant les coudes proches du corps.

4. Marquez un léger temps d''arrêt en bas du mouvement tout en conservant le contrôle de la charge.

5. Poussez la barre vers le haut en contractant les triceps et les pectoraux jusqu''à l''extension presque complète des bras.

6. Répétez le mouvement en gardant les coudes près du corps afin de maximiser le travail des triceps.','INTERMEDIATE','COMPOUND'),
                                                                           (81,'Flexion des poignets à la poulie','1. Asseyez-vous sur un banc et placez vos avant-bras sur vos cuisses ou sur un support, les poignets dépassant légèrement du bord.

2. Saisissez une barre ou des haltères avec une prise en supination, les paumes tournées vers le haut.

3. Abaissez lentement les poignets afin d''étirer les muscles de l''avant-bras tout en gardant les avant-bras immobiles.

4. Ramenez les poignets vers le haut en contractant les muscles fléchisseurs des avant-bras.

5. Marquez un léger temps d''arrêt en position haute afin de maximiser la contraction.

6. Répétez le mouvement en gardant les avant-bras fixes afin d''isoler efficacement les muscles de l''avant-bras.','BEGINNER','ISOLATION'),
                                                                           (42,'Leg extension','1. Asseyez-vous sur la machine à extension des jambes, le dos bien plaqué contre le dossier et les chevilles positionnées derrière les coussins.

2. Réglez la machine afin que l''axe de rotation soit aligné avec vos genoux et que vos jambes puissent effectuer une amplitude complète.

3. Tendez lentement les jambes en contractant les quadriceps jusqu''à ce que les genoux soient presque complètement dépliés.

4. Marquez un léger temps d''arrêt en position haute afin de maximiser la contraction des quadriceps.

5. Redescendez lentement les jambes en contrôlant la charge jusqu''à la position de départ.

6. Répétez le mouvement sans utiliser d''élan afin de conserver une tension constante sur les quadriceps.','BEGINNER','ISOLATION'),
                                                                           (52,'Élévations latérales à la poulie','1. Placez-vous debout à côté d''une poulie basse et saisissez la poignée avec la main opposée au câble.

2. Gardez le dos droit, les pieds légèrement écartés et le bras légèrement fléchi afin de maintenir une position stable.

3. Élevez lentement le bras sur le côté jusqu''à atteindre environ la hauteur de l''épaule, en guidant le mouvement avec le coude.

4. Marquez un léger temps d''arrêt en position haute afin de maximiser la contraction du deltoïde latéral.

5. Redescendez lentement le bras en contrôlant la charge jusqu''à la position initiale.

6. Répétez le mouvement de chaque côté en évitant de compenser avec le buste afin de conserver une tension constante sur l''épaule.','BEGINNER','ISOLATION');
INSERT INTO public.exercises (id,name,description,difficulty,mechanic) VALUES
                                                                           (12,'Extension mollets debout','1. Placez-vous debout sur une plateforme ou au sol, les pieds écartés à la largeur des hanches, avec les pointes de pieds légèrement vers l''avant.

2. Gardez le dos droit, les abdominaux contractés et placez la charge sur vos épaules ou tenez les poignées de la machine.

3. Montez lentement sur la pointe des pieds en poussant à travers l''avant du pied, jusqu''à obtenir une contraction maximale des mollets.

4. Marquez un léger temps d''arrêt en position haute tout en conservant le contrôle du mouvement et en contractant fortement les mollets.

5. Redescendez lentement les talons jusqu''à retrouver une amplitude complète, sans relâcher brutalement la charge.

6. Répétez le mouvement en gardant les jambes tendues et en évitant de rebondir afin de maximiser le travail des mollets.','BEGINNER','ISOLATION'),
                                                                           (19,'Curl barre','1. Placez-vous debout avec les pieds écartés à la largeur des épaules et saisissez une barre avec une prise en supination, les paumes vers le haut.

2. Gardez le dos droit, les coudes proches du corps et les épaules fixes pendant toute l''exécution du mouvement.

3. Pliez les coudes pour remonter la barre vers les épaules en contractant les biceps, sans utiliser l''élan du corps.

4. Marquez un léger temps d''arrêt en position haute tout en conservant la contraction des biceps.

5. Redescendez lentement la barre jusqu''à l''extension presque complète des bras en contrôlant la charge.

6. Répétez le mouvement en gardant les coudes fixes afin de maximiser le travail des biceps.','BEGINNER','ISOLATION'),
                                                                           (39,'Dips (Pectoraux)','1. Placez-vous entre les barres parallèles et saisissez-les fermement avec les mains, les bras tendus et le corps légèrement penché vers l''avant.

2. Gardez les épaules basses, la poitrine sortie et les jambes légèrement fléchies afin de maintenir une position stable.

3. Descendez lentement le corps en fléchissant les coudes jusqu''à ressentir un étirement des pectoraux, tout en gardant le buste incliné vers l''avant.

4. Marquez un léger temps d''arrêt en position basse tout en conservant le contrôle du mouvement.

5. Poussez dans les barres pour remonter en contractant les pectoraux jusqu''à revenir à la position de départ.

6. Répétez le mouvement en évitant de trop avancer les épaules afin de maximiser le travail des pectoraux.','INTERMEDIATE','ISOLATION'),
                                                                           (6,'Tirage poulie haute','1. Asseyez-vous face à la poulie haute, les pieds bien à plat au sol et les cuisses bloquées sous les supports afin de maintenir une position stable.

2. Saisissez la barre avec une prise légèrement plus large que les épaules, puis tendez les bras au-dessus de votre tête en gardant le buste droit.

3. Tirez la barre vers le haut de votre poitrine en abaissant les coudes vers le bas et vers l''arrière, tout en gardant les épaules basses et la poitrine sortie.

4. Marquez un léger temps d''arrêt en position basse en contractant les dorsaux, tout en conservant le contrôle de la charge.

5. Remontez lentement la barre jusqu''à la position de départ en laissant les bras se tendre progressivement, sans relâcher brutalement la tension musculaire.

6. Répétez le mouvement en gardant le buste stable et en évitant de tirer avec les bras afin de maximiser le travail des muscles du dos.','BEGINNER','ISOLATION'),
                                                                           (7,'Tirage poulie basse','1. Asseyez-vous face à la poulie basse, les pieds posés sur les supports et les genoux légèrement fléchis, puis saisissez la poignée avec les deux mains.

2. Gardez le dos droit, la poitrine sortie et les épaules basses, puis tendez les bras devant vous en laissant les omoplates légèrement s''étirer.

3. Tirez la poignée vers votre abdomen en ramenant les coudes vers l''arrière, tout en gardant le buste stable et en rapprochant les omoplates.

4. Marquez un léger temps d''arrêt en fin de mouvement en contractant les muscles du dos, tout en conservant le contrôle de la charge.

5. Revenez lentement à la position de départ en avançant les bras progressivement, sans arrondir le dos ni relâcher brutalement la tension.

6. Répétez le mouvement en gardant les coudes proches du corps et en vous concentrant sur la contraction du dos plutôt que sur l''impulsion du buste.','BEGINNER','ISOLATION'),
                                                                           (22,'Curl inversé barre','1. Placez-vous debout avec les pieds écartés à la largeur des épaules et saisissez une barre avec une prise en pronation, les paumes tournées vers le bas.

2. Gardez le dos droit, les coudes proches du corps et les épaules fixes pendant toute l''exécution du mouvement.

3. Fléchissez les coudes pour remonter la barre vers les épaules en gardant les poignets alignés avec les avant-bras.

4. Marquez un léger temps d''arrêt en position haute tout en contractant les biceps et les avant-bras.

5. Redescendez lentement la barre jusqu''à l''extension presque complète des bras en contrôlant la charge.

6. Répétez le mouvement en évitant de balancer le corps afin de maximiser le travail des muscles fléchisseurs du bras.','BEGINNER','ISOLATION'),
                                                                           (59,'Curl concentré','1. Asseyez-vous sur un banc, écartez les jambes et placez le coude contre l''intérieur de votre cuisse avec un haltère dans la main.

2. Gardez le dos droit et le bras légèrement tendu en position de départ.

3. Fléchissez lentement le coude pour remonter l''haltère vers l''épaule en contractant le biceps.

4. Marquez un léger temps d''arrêt en position haute afin de maximiser la contraction du biceps.

5. Redescendez lentement l''haltère jusqu''à l''extension presque complète du bras.

6. Répétez le mouvement en gardant le coude fixe afin d''isoler au maximum le biceps.','BEGINNER','ISOLATION'),
                                                                           (25,'Crunch','1. Allongez-vous sur le dos, les genoux fléchis et les pieds bien à plat au sol.

2. Placez vos mains derrière la tête ou croisées sur la poitrine, puis contractez légèrement les abdominaux.

3. Enroulez le haut du corps vers l''avant en décollant les épaules du sol tout en gardant le bas du dos en contact avec le sol.

4. Marquez un léger temps d''arrêt en position haute en contractant les abdominaux.

5. Redescendez lentement les épaules jusqu''à la position de départ en contrôlant le mouvement.

6. Répétez le mouvement en évitant de tirer sur la nuque afin de maximiser le travail des abdominaux.','BEGINNER','ISOLATION'),
                                                                           (20,'Traction supination','1. Saisissez la barre de traction avec une prise en supination, les paumes tournées vers vous, puis suspendez-vous avec les bras tendus.

2. Gardez le corps gainé, la poitrine sortie et les épaules basses afin de maintenir une position stable.

3. Tirez votre corps vers la barre en ramenant les coudes vers l''arrière jusqu''à ce que votre menton dépasse la barre.

4. Marquez un léger temps d''arrêt en position haute en contractant les dorsaux et les biceps.

5. Redescendez lentement jusqu''à l''extension complète des bras sans relâcher brutalement la tension.

6. Répétez le mouvement en évitant de balancer le corps afin de maximiser le travail du dos et des biceps.','BEGINNER','COMPOUND'),
                                                                           (26,'Planche','1. Placez-vous face au sol en appui sur les avant-bras et les pointes de pieds, avec les coudes positionnés sous les épaules.

2. Gardez le corps aligné de la tête aux talons, les abdominaux contractés et les fessiers légèrement engagés.

3. Maintenez la position en respirant régulièrement tout en conservant une tension constante dans la sangle abdominale.

4. Évitez de creuser le bas du dos ou de relever excessivement les hanches afin de conserver un alignement optimal.

5. Maintenez la position pendant la durée souhaitée tout en gardant un contrôle total du gainage.

6. Répétez l''exercice en augmentant progressivement le temps sous tension afin de renforcer les muscles profonds du tronc.','BEGINNER','COMPOUND');
INSERT INTO public.exercises (id,name,description,difficulty,mechanic) VALUES
                                                                           (27,'Planche latérale','1. Allongez-vous sur le côté, puis placez-vous en appui sur un avant-bras avec le coude positionné sous l''épaule.

2. Gardez les jambes tendues, les pieds superposés et le corps aligné de la tête aux pieds.

3. Contractez les abdominaux et les fessiers afin de maintenir le bassin décollé du sol.

4. Marquez un léger temps d''arrêt en position haute tout en conservant une tension constante dans les muscles du tronc.

5. Maintenez la position en respirant régulièrement et en évitant de laisser le bassin descendre.

6. Répétez l''exercice de chaque côté afin de renforcer les muscles obliques et stabilisateurs du tronc.','BEGINNER','COMPOUND'),
                                                                           (28,'Course à pied','1. Placez-vous debout avec une posture droite, les épaules détendues et le regard dirigé vers l''avant.

2. Commencez la course en adoptant une foulée naturelle, avec une légère inclinaison du corps vers l''avant.

3. Gardez les bras fléchis à environ 90° et accompagnez le mouvement des jambes avec un balancement contrôlé.

4. Maintenez une respiration régulière et adaptez votre allure afin de conserver un effort constant.

5. Continuez l''effort pendant la durée souhaitée en gardant une technique de course stable.

6. Répétez l''exercice en augmentant progressivement la durée ou l''intensité afin d''améliorer votre endurance cardiovasculaire.','BEGINNER','COMPOUND'),
                                                                           (29,'Rameur','1. Asseyez-vous sur le siège du rameur, placez vos pieds dans les cale-pieds et saisissez la poignée avec les deux mains.

2. Positionnez-vous bras tendus, dos droit et genoux fléchis pour démarrer le mouvement.

3. Poussez d''abord avec les jambes, puis tirez la poignée vers votre abdomen en engageant le dos et les bras.

4. Marquez un léger temps d''arrêt en fin de tirage en gardant les épaules basses et le dos gainé.

5. Revenez lentement à la position de départ en tendant les bras puis en fléchissant les genoux.

6. Répétez le mouvement en conservant une cadence régulière et une technique contrôlée afin d''optimiser le travail cardiovasculaire et musculaire.','BEGINNER','COMPOUND'),
                                                                           (30,'Vélo','1. Installez-vous sur le vélo et réglez la hauteur de selle afin que votre jambe soit légèrement fléchie lorsque la pédale est en position basse.

2. Placez vos pieds correctement sur les pédales et adoptez une position confortable avec le dos droit.

3. Commencez à pédaler en effectuant un mouvement régulier et contrôlé avec les jambes.

4. Maintenez une cadence adaptée à votre objectif en contrôlant votre respiration et votre intensité d''effort.

5. Continuez le mouvement pendant la durée souhaitée en conservant une posture stable.

6. Répétez l''exercice en augmentant progressivement la durée ou la résistance afin d''améliorer votre endurance cardiovasculaire.','BEGINNER','COMPOUND'),
                                                                           (37,'Pec Deck','1. Asseyez-vous sur la machine Pec Deck, le dos bien plaqué contre le dossier et les pieds bien à plat au sol.

2. Placez vos avant-bras ou vos mains sur les supports prévus et gardez les épaules basses avec la poitrine sortie.

3. Ramenez lentement les bras vers l''avant en rapprochant les poignées ou les supports grâce à une contraction des pectoraux.

4. Marquez un léger temps d''arrêt lorsque les bras sont rapprochés afin de maximiser la contraction musculaire.

5. Revenez lentement à la position de départ en contrôlant l''ouverture des bras afin de conserver la tension sur les pectoraux.

6. Répétez le mouvement en évitant d''utiliser l''élan du corps afin de maximiser le travail des muscles pectoraux.','BEGINNER','COMPOUND'),
                                                                           (41,'Presse à cuisses inclinée','1. Installez-vous sur la presse à cuisses inclinée, le dos et les fessiers bien plaqués contre le dossier, puis placez vos pieds sur la plateforme avec un écartement légèrement supérieur à la largeur des épaules.

2. Déverrouillez la sécurité et gardez les genoux légèrement fléchis en position de départ, sans chercher à les verrouiller complètement.

3. Descendez lentement la plateforme en fléchissant les genoux et en contrôlant la charge, jusqu''à obtenir une amplitude confortable tout en gardant le bas du dos collé au dossier.

4. Marquez un léger temps d''arrêt en position basse tout en conservant la tension dans les quadriceps et les fessiers.

5. Poussez dans vos pieds pour repousser la plateforme jusqu''à la position de départ, sans verrouiller brutalement les genoux.

6. Répétez le mouvement en gardant les genoux alignés avec les pointes de pieds afin de maximiser le travail des jambes et limiter les contraintes articulaires.','BEGINNER','COMPOUND'),
                                                                           (51,'Élévation latérale machine','1. Asseyez-vous sur la machine d''élévations latérales, le dos droit contre le dossier et les pieds bien à plat au sol.

2. Placez vos bras contre les supports prévus à cet effet, gardez les épaules basses et les abdominaux légèrement contractés.

3. Élevez lentement les bras sur les côtés jusqu''à atteindre environ la hauteur des épaules, en dirigeant le mouvement avec les coudes.

4. Marquez un léger temps d''arrêt en position haute afin de contracter les deltoïdes latéraux tout en conservant le contrôle de la charge.

5. Redescendez lentement les bras jusqu''à la position de départ sans relâcher brutalement la tension.

6. Répétez le mouvement en évitant de hausser les épaules afin de maximiser le travail des deltoïdes latéraux.','BEGINNER','COMPOUND'),
                                                                           (55,'Tirage horizontal poulie','1. Asseyez-vous face à la poulie basse, placez vos pieds sur les supports et saisissez la poignée avec les deux mains.

2. Gardez le dos droit, la poitrine sortie et les épaules basses, puis tendez les bras devant vous en laissant les omoplates légèrement s''écarter.

3. Tirez la poignée vers votre abdomen en ramenant les coudes vers l''arrière et en rapprochant les omoplates.

4. Marquez un léger temps d''arrêt en fin de tirage afin de contracter les muscles du dos.

5. Revenez lentement à la position de départ en contrôlant la charge sans arrondir le dos.

6. Répétez le mouvement en évitant de tirer avec les bras uniquement afin de maximiser le travail des dorsaux et des muscles du milieu du dos.','BEGINNER','COMPOUND'),
                                                                           (56,'Tirage vertical','1. Asseyez-vous face à la poulie haute, bloquez vos cuisses sous les supports et saisissez la barre avec une prise adaptée.

2. Gardez le dos droit, la poitrine sortie et les épaules basses avec les bras tendus au-dessus de la tête.

3. Tirez la barre vers le haut de votre poitrine en abaissant les coudes vers le bas et vers l''arrière.

4. Marquez un léger temps d''arrêt en position basse en contractant les dorsaux.

5. Remontez lentement la barre jusqu''à la position de départ en contrôlant la charge.

6. Répétez le mouvement en évitant de vous balancer afin de maximiser le travail des muscles du dos.','BEGINNER','COMPOUND'),
                                                                           (58,'Shrug','1. Placez-vous debout avec un haltère dans chaque main ou une barre tenue devant vous, les bras relâchés le long du corps.

2. Gardez le dos droit, les épaules basses et les bras complètement détendus afin d''isoler les trapèzes.

3. Haussez lentement les épaules vers les oreilles en contractant les trapèzes, sans effectuer de rotation.

4. Marquez un léger temps d''arrêt en position haute afin de maximiser la contraction musculaire.

5. Redescendez lentement les épaules jusqu''à la position de départ en contrôlant la charge.

6. Répétez le mouvement en évitant d''utiliser les bras afin de concentrer l''effort sur les trapèzes.','BEGINNER','ISOLATION');
INSERT INTO public.exercises (id,name,description,difficulty,mechanic) VALUES
                                                                           (72,'Presse à cuisses horizontale','1. Installez-vous sur la presse horizontale avec le dos et les fessiers bien plaqués contre le dossier, puis placez vos pieds sur la plateforme.

2. Gardez les pieds écartés à la largeur des épaules et les genoux légèrement fléchis en position de départ.

3. Descendez lentement la plateforme en fléchissant les genoux tout en gardant le dos stable contre le dossier.

4. Marquez un léger temps d''arrêt en position basse en conservant le contrôle de la charge.

5. Poussez dans vos pieds pour repousser la plateforme jusqu''à la position initiale sans verrouiller brutalement les genoux.

6. Répétez le mouvement en gardant les genoux alignés avec les pointes de pieds afin de maximiser le travail des jambes.','BEGINNER','COMPOUND'),
                                                                           (76,'Tractions australiennes','1. Placez une barre à hauteur adaptée et positionnez-vous dessous, les mains en prise légèrement plus large que les épaules.

2. Tendez les jambes devant vous avec les talons au sol, gardez le corps aligné et les abdominaux contractés.

3. Tirez votre poitrine vers la barre en ramenant les coudes vers l''arrière tout en gardant les épaules basses.

4. Marquez un léger temps d''arrêt en position haute en contractant les muscles du dos.

5. Redescendez lentement jusqu''à l''extension complète des bras en contrôlant le mouvement.

6. Répétez l''exercice en gardant le corps gainé afin de maximiser le travail des dorsaux et des muscles du haut du dos.','BEGINNER','COMPOUND'),
                                                                           (80,'Face pull','1. Placez une corde sur une poulie haute et saisissez-la avec les deux mains, les paumes face à face.

2. Reculez légèrement pour créer une tension dans le câble, gardez le dos droit et les épaules basses.

3. Tirez la corde vers votre visage en écartant les mains et en ramenant les coudes vers l''arrière.

4. Marquez un léger temps d''arrêt lorsque vos mains arrivent de chaque côté du visage afin de contracter les deltoïdes postérieurs et les trapèzes.

5. Revenez lentement à la position de départ en contrôlant la charge.

6. Répétez le mouvement en évitant de hausser les épaules afin de maximiser le travail de l''arrière des épaules.','BEGINNER','COMPOUND'),
                                                                           (86,'Pull over à la poulie','1. Placez-vous debout face à une poulie haute équipée d''une barre ou d''une corde, puis saisissez la poignée avec les deux mains.

2. Avancez légèrement les pieds, inclinez légèrement le buste vers l''avant et gardez le dos droit avec les bras tendus.

3. Ramenez lentement la charge vers vos cuisses en effectuant un mouvement d''arc tout en gardant les bras presque tendus.

4. Marquez un léger temps d''arrêt en position basse en contractant les dorsaux.

5. Revenez lentement à la position de départ en contrôlant la remontée de la charge.

6. Répétez le mouvement en évitant de fléchir excessivement les coudes afin de maximiser le travail des dorsaux.','BEGINNER','COMPOUND'),
                                                                           (87,'Rowing buste penché avec élastiques','1. Placez-vous debout sur l''élastique avec les pieds écartés à la largeur des épaules et saisissez les poignées avec les deux mains.

2. Inclinez le buste vers l''avant en gardant le dos droit, les genoux légèrement fléchis et les abdominaux contractés.

3. Tirez les poignées vers votre bassin en ramenant les coudes vers l''arrière tout en gardant les épaules basses.

4. Marquez un léger temps d''arrêt en position haute afin de contracter les muscles du dos.

5. Revenez lentement à la position de départ en contrôlant la tension de l''élastique.

6. Répétez le mouvement sans arrondir le dos afin de maximiser le travail des dorsaux et des muscles du milieu du dos.','BEGINNER','COMPOUND'),
                                                                           (94,'Shoulder press','1. Asseyez-vous sur la machine Shoulder Press, le dos bien plaqué contre le dossier et les pieds bien à plat au sol.

2. Saisissez les poignées avec une prise légèrement plus large que les épaules, les coudes fléchis en position de départ.

3. Poussez les poignées vers le haut jusqu''à l''extension presque complète des bras en contractant les épaules.

4. Marquez un léger temps d''arrêt en position haute sans verrouiller brutalement les coudes.

5. Redescendez lentement les poignées jusqu''à la position initiale en contrôlant la charge.

6. Répétez le mouvement en gardant le dos stable afin de maximiser le travail des deltoïdes.','BEGINNER','COMPOUND'),
                                                                           (99,'Machine à dips','1. Installez-vous sur la machine à dips, placez vos genoux ou vos pieds sur le support d''assistance et saisissez les poignées.

2. Gardez le buste droit, les coudes proches du corps et les épaules basses.

3. Descendez lentement en fléchissant les coudes jusqu''à obtenir une amplitude confortable.

4. Marquez un léger temps d''arrêt en position basse tout en conservant la tension musculaire.

5. Poussez dans les poignées pour remonter en contractant les triceps et revenir à la position de départ.

6. Répétez le mouvement en gardant les coudes proches du corps afin de maximiser le travail des triceps.','BEGINNER','COMPOUND'),
                                                                           (2,'Développé incliné haltères','1. Réglez le banc sur une inclinaison d''environ 30 à 45°, puis asseyez-vous avec les pieds bien à plat au sol et les omoplates légèrement serrées.

2. Saisissez un haltère dans chaque main et positionnez-les de part et d''autre du haut de votre poitrine, les paumes orientées vers l''avant.

3. Poussez les haltères vers le haut jusqu''à ce que vos bras soient presque complètement tendus, en conservant un léger fléchissement des coudes.

4. Descendez lentement les haltères en fléchissant les coudes jusqu''à ce qu''ils soient légèrement en dessous du niveau du banc, tout en gardant les avant-bras verticaux.

5. Marquez un léger temps d''arrêt en bas du mouvement, puis contractez les pectoraux pour repousser les haltères vers la position de départ, sans verrouiller brutalement les coudes.

6. Répétez le mouvement en gardant une trajectoire fluide et symétrique, sans laisser les haltères s''entrechoquer en haut du mouvement.','INTERMEDIATE','COMPOUND'),
                                                                           (1,'Développé couché haltères','1. Allongez-vous sur un banc plat, les pieds bien à plat au sol et les omoplates légèrement serrées.

2. Saisissez un haltère dans chaque main avec une prise neutre, puis positionnez-les de part et d''autre de votre poitrine, les bras presque tendus.

3. Descendez lentement les haltères en fléchissant les coudes jusqu''à ce qu''ils soient légèrement en dessous du niveau du banc, tout en gardant les avant-bras verticaux.

4. Marquez un léger temps d''arrêt en bas du mouvement tout en conservant le contrôle des haltères et en gardant la poitrine sortie.

5. Poussez les haltères vers le haut en contractant les pectoraux jusqu''à l''extension presque complète des bras, sans verrouiller brutalement les coudes.

6. Répétez le mouvement en gardant une trajectoire contrôlée et symétrique, sans laisser les haltères s''entrechoquer en haut du mouvement.','INTERMEDIATE','COMPOUND'),
                                                                           (21,'Curl marteau haltères','1. Placez-vous debout avec les pieds écartés à la largeur des épaules et saisissez un haltère dans chaque main avec une prise neutre, les paumes face à face.

2. Gardez le dos droit, les épaules basses et les coudes proches du corps pendant toute l''exécution du mouvement.

3. Fléchissez les coudes pour remonter les haltères vers les épaules en conservant les poignets neutres, sans effectuer de rotation.

4. Marquez un léger temps d''arrêt en position haute tout en contractant les biceps et les muscles de l''avant-bras.

5. Redescendez lentement les haltères jusqu''à l''extension presque complète des bras en contrôlant la charge.

6. Répétez le mouvement en gardant les coudes fixes afin de maximiser le travail des biceps et des brachiaux.','BEGINNER','ISOLATION');
INSERT INTO public.exercises (id,name,description,difficulty,mechanic) VALUES
                                                                           (9,'Squats','1. Placez-vous debout avec les pieds légèrement plus écartés que la largeur des épaules, les pointes de pieds légèrement orientées vers l''extérieur, puis positionnez la barre sur le haut du dos.

2. Gardez le dos droit, la poitrine sortie et les abdominaux contractés, puis retirez la barre du support en maintenant une position stable.

3. Descendez lentement en fléchissant les genoux et les hanches, tout en poussant les fesses vers l''arrière et en gardant les genoux alignés avec les pointes de pieds.

4. Marquez un léger temps d''arrêt en position basse lorsque vos cuisses atteignent environ la parallèle au sol, tout en conservant le contrôle de la charge.

5. Poussez dans vos pieds pour remonter en contractant les quadriceps et les fessiers, puis revenez à la position de départ sans verrouiller brutalement les genoux.

6. Répétez le mouvement en gardant le dos gainé et en évitant que les genoux rentrent vers l''intérieur afin de maximiser le travail des jambes.','INTERMEDIATE','COMPOUND'),
                                                                           (24,'Relevé de jambes suspendu','1. Suspendez-vous à une barre fixe avec une prise légèrement plus large que les épaules, les bras tendus et le corps gainé.

2. Gardez les épaules basses, le dos stable et les jambes tendues ou légèrement fléchies selon votre niveau.

3. Relevez lentement les jambes vers l''avant en effectuant une bascule du bassin afin de contracter les abdominaux.

4. Marquez un léger temps d''arrêt en position haute tout en conservant le contrôle du mouvement.

5. Redescendez lentement les jambes jusqu''à la position de départ sans relâcher brutalement la tension.

6. Répétez le mouvement en évitant les mouvements de balancier afin de maximiser le travail de la sangle abdominale.','INTERMEDIATE','ISOLATION'),
                                                                           (43,'Soulevé de terre','1. Placez une barre au sol devant vous, les pieds écartés à la largeur des hanches et les pointes légèrement orientées vers l''extérieur.

2. Saisissez la barre avec une prise adaptée, gardez le dos droit, la poitrine sortie et les abdominaux contractés.

3. Soulevez la barre en poussant dans le sol avec les jambes tout en gardant la barre proche du corps et le dos stable.

4. Continuez la montée en dépliant les hanches jusqu''à être complètement redressé, sans exagérer l''extension du dos.

5. Redescendez lentement la barre en reculant les hanches puis en fléchissant les genoux lorsque la barre arrive au niveau des jambes.

6. Répétez le mouvement en conservant une posture solide afin de maximiser le travail des ischio-jambiers, des fessiers et du dos.','INTERMEDIATE','COMPOUND'),
                                                                           (46,'Pistol squat','1. Placez-vous debout sur une jambe, l''autre jambe tendue devant vous, avec le buste droit et les abdominaux contractés.

2. Descendez lentement en fléchissant la jambe d''appui tout en envoyant les hanches vers l''arrière afin de conserver votre équilibre.

3. Continuez la descente jusqu''à atteindre votre amplitude maximale en gardant le pied bien ancré au sol.

4. Marquez un léger temps d''arrêt en position basse tout en conservant le contrôle du mouvement.

5. Poussez dans votre pied d''appui pour revenir à la position de départ en contractant les quadriceps et les fessiers.

6. Répétez le mouvement de chaque côté en maintenant une bonne stabilité afin de maximiser le travail des jambes.','INTERMEDIATE','COMPOUND'),
                                                                           (78,'Romanian Deadlift (RDL)','1. Placez-vous debout avec une barre dans les mains, les pieds écartés à la largeur des hanches et la barre proche des cuisses.

2. Gardez le dos droit, les épaules basses et les abdominaux contractés pendant toute l''exécution du mouvement.

3. Repoussez les hanches vers l''arrière en inclinant le buste vers l''avant tout en gardant les jambes légèrement fléchies.

4. Descendez la barre le long des jambes jusqu''à ressentir un étirement des ischio-jambiers, sans arrondir le dos.

5. Poussez dans le sol et ramenez les hanches vers l''avant pour revenir en position debout en contractant les fessiers.

6. Répétez le mouvement en gardant la barre proche du corps afin de maximiser le travail des ischio-jambiers et des fessiers.','INTERMEDIATE','COMPOUND'),
                                                                           (91,'Shrug a la barre','1. Placez-vous debout avec une barre tenue devant vous, les pieds écartés à la largeur des épaules et les bras relâchés.

2. Gardez le dos droit, les épaules basses et les bras tendus afin d''isoler les trapèzes.

3. Haussez lentement les épaules vers les oreilles en contractant les trapèzes, sans effectuer de rotation.

4. Marquez un léger temps d''arrêt en position haute afin de maximiser la contraction musculaire.

5. Redescendez lentement les épaules jusqu''à la position de départ en contrôlant la charge.

6. Répétez le mouvement sans utiliser les bras afin de concentrer l''effort sur les trapèzes.','BEGINNER','ISOLATION'),
                                                                           (95,'Rear kick','1. Placez-vous debout face à une poulie basse ou utilisez un élastique fixé au sol, avec la cheville attachée.

2. Gardez le dos droit, les abdominaux contractés et appuyez-vous sur un support si nécessaire.

3. Ramenez lentement la jambe vers l''arrière en contractant le fessier tout en gardant le bassin stable.

4. Marquez un léger temps d''arrêt en position haute afin de maximiser la contraction musculaire.

5. Revenez lentement à la position de départ en contrôlant la résistance.

6. Répétez le mouvement de chaque côté en évitant de cambrer le dos afin de cibler efficacement les fessiers.','INTERMEDIATE','ISOLATION'),
                                                                           (100,'Marche','1. Placez-vous debout avec une posture droite, les épaules détendues et le regard dirigé vers l''avant.

2. Commencez à marcher en posant naturellement le talon puis l''avant du pied afin de conserver une foulée fluide.

3. Gardez les bras légèrement fléchis et accompagnez le mouvement avec un balancement naturel.

4. Maintenez une respiration régulière et adaptez votre allure selon votre objectif.

5. Continuez l''effort pendant la durée souhaitée en conservant une posture stable.

6. Répétez l''activité régulièrement afin d''améliorer l''endurance cardiovasculaire et favoriser la dépense énergétique.','BEGINNER','COMPOUND'),
                                                                           (8,'Pompes diamant','1. Placez-vous en position de pompe avec les mains rapprochées sous votre poitrine, les pouces et les index formant un triangle, puis tendez les jambes avec les pieds en appui au sol.

2. Gardez le corps aligné de la tête aux talons, les abdominaux contractés et les fessiers légèrement engagés afin de maintenir une position stable.

3. Descendez lentement votre poitrine vers vos mains en fléchissant les coudes, en gardant les coudes proches du corps pour maximiser le travail des triceps.

4. Marquez un léger temps d''arrêt en bas du mouvement tout en conservant le contrôle et en maintenant la tension dans les bras et la poitrine.

5. Poussez dans vos mains pour tendre les bras et revenir à la position de départ, sans verrouiller brutalement les coudes.

6. Répétez le mouvement en gardant le corps gainé et en évitant de creuser le bas du dos afin de maximiser le travail des triceps.','INTERMEDIATE','COMPOUND'),
                                                                           (17,'Tractions prise neutre','1. Saisissez les poignées parallèles de la barre de traction avec une prise neutre, les paumes face à face, puis suspendez-vous avec les bras tendus.

2. Gardez le corps gainé, la poitrine sortie et les épaules basses afin de maintenir une position stable.

3. Tirez votre corps vers le haut en ramenant les coudes vers le bas jusqu''à rapprocher votre poitrine des poignées.

4. Marquez un léger temps d''arrêt en position haute en contractant le dos et les bras.

5. Redescendez lentement jusqu''à l''extension complète des bras en gardant le contrôle du mouvement.

6. Répétez le mouvement en évitant les mouvements de balancier afin de maximiser le travail des dorsaux et des biceps.','INTERMEDIATE','COMPOUND');
INSERT INTO public.exercises (id,name,description,difficulty,mechanic) VALUES
                                                                           (18,'Tractions prise serrée','1. Saisissez la barre de traction avec une prise serrée, les mains rapprochées, puis suspendez-vous avec les bras tendus.

2. Gardez le corps gainé, la poitrine sortie et les épaules basses pour maintenir une bonne position de départ.

3. Tirez votre corps vers la barre en ramenant les coudes vers l''arrière jusqu''à rapprocher votre poitrine de la barre.

4. Marquez un léger temps d''arrêt en position haute en contractant les dorsaux et les biceps.

5. Redescendez lentement jusqu''à l''extension complète des bras sans perdre la tension musculaire.

6. Répétez le mouvement en gardant un mouvement contrôlé afin de maximiser le travail du dos et des bras.','INTERMEDIATE','COMPOUND'),
                                                                           (14,'Développé militaire','1. Placez-vous debout ou assis avec le dos droit, les pieds bien ancrés au sol et saisissez la barre avec une prise légèrement plus large que les épaules.

2. Positionnez la barre au niveau du haut de la poitrine, les coudes légèrement vers l''avant et les abdominaux contractés.

3. Poussez la barre vers le haut en tendant les bras au-dessus de la tête, tout en gardant le corps stable et aligné.

4. Marquez un léger temps d''arrêt en position haute en contractant les épaules, sans verrouiller brutalement les coudes.

5. Redescendez lentement la barre jusqu''à la position de départ en contrôlant la charge.

6. Répétez le mouvement en évitant de cambrer excessivement le dos afin de maximiser le travail des deltoïdes.','INTERMEDIATE','COMPOUND'),
                                                                           (5,'Extension verticale','1. Asseyez-vous sur un banc ou restez debout avec le dos droit, les pieds bien ancrés au sol et les abdominaux légèrement contractés.

2. Saisissez un haltère avec les deux mains et positionnez-le au-dessus de votre tête, les bras tendus et les coudes proches des oreilles.

3. En gardant les coudes fixes et orientés vers l''avant, fléchissez uniquement les coudes pour descendre lentement l''haltère derrière votre tête.

4. Marquez un léger temps d''arrêt en position basse tout en conservant le contrôle de la charge et en maintenant les épaules stables.

5. Contractez les triceps pour tendre les bras et ramener l''haltère à la position de départ, sans verrouiller brutalement les coudes.

6. Répétez le mouvement en gardant les coudes serrés et en évitant de cambrer le dos afin de maximiser le travail des triceps.','INTERMEDIATE','ISOLATION'),
                                                                           (60,'Curl haltères','1. Placez-vous debout avec un haltère dans chaque main, les bras le long du corps et les paumes tournées vers l''avant.

2. Gardez le dos droit, les épaules fixes et les coudes proches du corps pendant toute l''exécution.

3. Fléchissez les coudes pour remonter les haltères vers les épaules en contractant les biceps.

4. Marquez un léger temps d''arrêt en position haute afin de maximiser la contraction musculaire.

5. Redescendez lentement les haltères jusqu''à l''extension presque complète des bras.

6. Répétez le mouvement en évitant de balancer le corps afin de conserver une tension constante sur les biceps.','BEGINNER','ISOLATION'),
                                                                           (61,'Curl pupitre','1. Asseyez-vous sur le banc Larry Scott avec les bras posés sur le support incliné et saisissez la barre ou les haltères avec une prise en supination.

2. Gardez les épaules fixes, la poitrine contre le support et les coudes légèrement fléchis en position de départ.

3. Fléchissez lentement les coudes pour remonter la charge vers les épaules en contractant les biceps.

4. Marquez un léger temps d''arrêt en position haute afin de maximiser la contraction musculaire.

5. Redescendez lentement la charge jusqu''à l''extension presque complète des bras en conservant le contrôle.

6. Répétez le mouvement en gardant les bras plaqués contre le support afin d''isoler efficacement les biceps.','BEGINNER','ISOLATION'),
                                                                           (73,'Leg curl','1. Installez-vous sur la machine leg curl, placez vos chevilles derrière les coussins et maintenez votre bassin bien stable.

2. Gardez le dos plaqué contre le dossier ou le ventre contre le support selon le type de machine.

3. Fléchissez lentement les genoux pour ramener les talons vers les fessiers en contractant les ischio-jambiers.

4. Marquez un léger temps d''arrêt en position haute afin de maximiser la contraction musculaire.

5. Redescendez lentement les jambes jusqu''à la position de départ en contrôlant la charge.

6. Répétez le mouvement sans utiliser d''élan afin de conserver une tension constante sur les ischio-jambiers.','BEGINNER','ISOLATION'),
                                                                           (13,'Élévation latérales','1. Placez-vous debout avec les pieds écartés à la largeur des épaules, le dos droit et un haltère dans chaque main le long du corps.

2. Gardez les bras légèrement fléchis et les épaules basses, puis préparez le mouvement en maintenant une position stable.

3. Élevez lentement les haltères sur les côtés jusqu''à atteindre environ la hauteur des épaules, en dirigeant le mouvement avec les coudes.

4. Marquez un léger temps d''arrêt en position haute tout en contractant les deltoïdes latéraux et en conservant le contrôle de la charge.

5. Redescendez lentement les haltères jusqu''à la position de départ sans laisser les bras tomber brusquement.

6. Répétez le mouvement en évitant de tricher avec le buste afin de maximiser le travail des épaules.','BEGINNER','ISOLATION'),
                                                                           (62,'Curl incliné','1. Allongez-vous sur un banc incliné, les pieds bien à plat au sol et un haltère dans chaque main avec les bras tendus vers le sol.

2. Gardez les épaules en arrière, le dos contre le banc et les coudes légèrement en retrait du corps.

3. Fléchissez lentement les coudes pour remonter les haltères vers les épaules en contractant les biceps.

4. Marquez un léger temps d''arrêt en position haute afin de maximiser la contraction musculaire.

5. Redescendez lentement les haltères jusqu''à l''extension presque complète des bras en contrôlant la charge.

6. Répétez le mouvement sans avancer les coudes afin de conserver une tension constante sur les biceps.','BEGINNER','ISOLATION'),
                                                                           (66,'Rotations russes','1. Asseyez-vous au sol avec les genoux légèrement fléchis, les pieds posés ou décollés selon votre niveau, et le buste légèrement incliné vers l''arrière.

2. Gardez le dos droit, les abdominaux contractés et saisissez une charge avec les deux mains devant vous.

3. Tournez lentement le buste d''un côté puis de l''autre en accompagnant le mouvement avec les épaules.

4. Marquez un léger temps d''arrêt de chaque côté afin de maximiser le travail des muscles obliques.

5. Revenez au centre en contrôlant chaque rotation.

6. Répétez le mouvement en évitant de bouger uniquement les bras afin de solliciter efficacement les obliques.','BEGINNER','ISOLATION'),
                                                                           (69,'Extension mollets assis','1. Asseyez-vous sur la machine à mollets, placez l''avant des pieds sur la plateforme et positionnez les coussins sur vos cuisses.

2. Gardez le dos droit et les genoux fixes pendant toute l''exécution du mouvement.

3. Abaissez lentement les talons vers le bas afin d''obtenir un étirement complet des mollets.

4. Poussez sur l''avant des pieds pour remonter les talons le plus haut possible en contractant les mollets.

5. Marquez un léger temps d''arrêt en position haute afin de maximiser la contraction musculaire.

6. Répétez le mouvement en contrôlant chaque phase afin de conserver une tension constante sur les mollets.','BEGINNER','ISOLATION');
INSERT INTO public.exercises (id,name,description,difficulty,mechanic) VALUES
                                                                           (71,'Tirage dos à la poulie haute','1. Asseyez-vous face à la poulie haute, bloquez vos cuisses sous les supports et saisissez la barre avec une prise adaptée.

2. Gardez le dos droit, la poitrine sortie et les bras tendus au-dessus de la tête.

3. Tirez la barre vers le haut de votre poitrine en abaissant les coudes vers le bas et vers l''arrière.

4. Marquez un léger temps d''arrêt en position basse en contractant les dorsaux.

5. Remontez lentement la barre jusqu''à l''extension complète des bras en contrôlant la charge.

6. Répétez le mouvement en évitant de vous balancer afin de maximiser le travail du dos.','BEGINNER','ISOLATION'),
                                                                           (75,'Abducteurs assis à la machine','1. Asseyez-vous sur la machine à abducteurs, le dos bien plaqué contre le dossier et les pieds positionnés sur les supports.

2. Placez vos jambes contre les coussins prévus à cet effet et gardez le buste droit pendant toute l''exécution.

3. Écartez lentement les genoux vers l''extérieur en contractant les muscles abducteurs et les fessiers.

4. Marquez un léger temps d''arrêt en position ouverte afin de maximiser la contraction musculaire.

5. Revenez lentement à la position de départ en contrôlant le retour des jambes.

6. Répétez le mouvement sans utiliser d''élan afin de conserver une tension constante sur les muscles ciblés.','BEGINNER','ISOLATION'),
                                                                           (77,'Extension mollets presse à cuisses','1. Installez-vous sur la presse à cuisses et placez l''avant des pieds sur la partie basse de la plateforme, avec les jambes presque tendues.

2. Gardez les genoux légèrement fléchis et le dos ainsi que les fessiers bien plaqués contre le dossier.

3. Abaissez lentement les talons vers vous afin d''obtenir un étirement complet des mollets.

4. Poussez avec l''avant des pieds pour remonter les talons le plus haut possible en contractant les mollets.

5. Marquez un léger temps d''arrêt en position haute afin de maximiser la contraction musculaire.

6. Répétez le mouvement en gardant une amplitude contrôlée et sans effectuer de rebond afin de conserver une tension constante.','BEGINNER','ISOLATION'),
                                                                           (23,'Crunch à la poulie haute','1. Placez-vous à genoux face à une poulie haute et saisissez la corde avec les deux mains, en la positionnant près de votre tête.

2. Gardez les hanches fixes, le dos légèrement arrondi et les abdominaux contractés avant de commencer le mouvement.

3. Enroulez le buste vers l''avant en rapprochant les côtes du bassin grâce à une contraction des abdominaux.

4. Marquez un léger temps d''arrêt en position basse tout en maintenant la tension dans les abdominaux.

5. Revenez lentement à la position de départ en contrôlant la remontée sans laisser la charge tirer votre corps.

6. Répétez le mouvement en évitant de tirer avec les bras afin de maximiser le travail des abdominaux.','INTERMEDIATE','ISOLATION'),
                                                                           (3,'Écartés poulie haute','1. Placez-vous debout au centre d''une poulie vis-à-vis avec les poignées réglées en position haute, puis saisissez une poignée dans chaque main.

2. Avancez légèrement un pied devant l''autre, inclinez légèrement le buste vers l''avant et gardez le dos droit avec les épaules basses.

3. En gardant une légère flexion des coudes, écartez les bras vers le bas et vers l''avant en effectuant un mouvement d''arc jusqu''à rapprocher les poignées devant votre bassin.

4. Marquez un léger temps d''arrêt en position basse tout en contractant les pectoraux et en conservant le contrôle de la charge.

5. Ramenez lentement les poignées à la position de départ en ouvrant les bras, sans laisser la charge tirer brusquement vos épaules vers l''arrière.

6. Répétez le mouvement en gardant les coudes légèrement fléchis et en vous concentrant sur la contraction des pectoraux plutôt que sur l''élan du corps.','INTERMEDIATE','ISOLATION'),
                                                                           (4,'Écartés unilatéral','1. Placez-vous debout à côté d''une poulie réglée en position haute, puis saisissez la poignée avec une seule main.

2. Avancez légèrement le pied opposé au bras travaillé, inclinez légèrement le buste vers l''avant et gardez le dos droit avec l''épaule basse et stable.

3. En conservant une légère flexion du coude, ramenez la poignée vers le bas et vers l''intérieur du corps en effectuant un mouvement d''arc jusqu''à aligner votre main devant le bassin.

4. Marquez un léger temps d''arrêt en position basse tout en contractant le pectoral du côté travaillé et en maintenant la tension constante sur le muscle.

5. Revenez lentement à la position de départ en contrôlant la remontée de la charge, sans laisser l''épaule partir vers l''arrière.

6. Répétez le mouvement en vous concentrant sur l''amplitude et la contraction du pectoral, puis changez de côté pour travailler l''autre bras.','INTERMEDIATE','ISOLATION'),
                                                                           (53,'Élévations frontales','1. Placez-vous debout avec les pieds écartés à la largeur des épaules et saisissez un haltère dans chaque main devant vos cuisses.

2. Gardez le dos droit, les épaules basses et les bras légèrement fléchis pendant toute l''exécution du mouvement.

3. Levez lentement les bras vers l''avant jusqu''à atteindre environ la hauteur des épaules, en gardant les poignets dans une position neutre.

4. Marquez un léger temps d''arrêt en position haute en contractant les deltoïdes antérieurs.

5. Redescendez lentement les haltères jusqu''à la position de départ en contrôlant la charge.

6. Répétez le mouvement sans utiliser d''élan avec le corps afin de maximiser le travail des épaules.','BEGINNER','ISOLATION'),
                                                                           (50,'Dips (triceps)','1. Placez-vous entre les barres parallèles et saisissez-les fermement avec les mains, les bras tendus et le corps proche de la verticale.

2. Gardez les épaules basses, les coudes proches du corps et les abdominaux contractés afin de maintenir une position stable.

3. Descendez lentement le corps en fléchissant les coudes jusqu''à obtenir une amplitude confortable, tout en gardant les coudes dirigés vers l''arrière.

4. Marquez un léger temps d''arrêt en position basse en conservant le contrôle du mouvement.

5. Poussez dans les barres pour remonter en contractant les triceps jusqu''à revenir à la position de départ.

6. Répétez le mouvement en évitant d''écarter les coudes afin de maximiser le travail des triceps.','INTERMEDIATE','ISOLATION'),
                                                                           (49,'Barre au front','1. Allongez-vous sur un banc plat, les pieds bien à plat au sol et les omoplates légèrement serrées.

2. Saisissez une barre EZ ou une barre droite avec une prise à la largeur des épaules, puis tendez les bras au-dessus de votre poitrine.

3. En gardant les coudes fixes et orientés vers le plafond, fléchissez uniquement les coudes pour descendre lentement la barre vers le front ou juste derrière la tête.

4. Marquez un léger temps d''arrêt en bas du mouvement tout en conservant le contrôle de la charge.

5. Contractez les triceps pour tendre les bras et ramener la barre à la position de départ, sans verrouiller brutalement les coudes.

6. Répétez le mouvement en gardant les coudes stables et en évitant de les écarter afin de maximiser le travail des triceps.','INTERMEDIATE','ISOLATION'),
                                                                           (64,'Mountain climber','1. Placez-vous en position de pompe avec les mains sous les épaules, les bras tendus et le corps aligné.

2. Contractez les abdominaux et gardez le bassin stable pendant toute l''exécution du mouvement.

3. Ramenez alternativement un genou vers la poitrine puis replacez la jambe en position initiale.

4. Alternez rapidement les jambes tout en conservant une posture contrôlée.

5. Maintenez une respiration régulière et gardez les épaules au-dessus des mains.

6. Répétez le mouvement en évitant de relever excessivement les hanches afin de solliciter efficacement la sangle abdominale.','INTERMEDIATE','ISOLATION');
INSERT INTO public.exercises (id,name,description,difficulty,mechanic) VALUES
                                                                           (68,'Toe Touch','1. Allongez-vous sur le dos avec les jambes tendues vers le plafond et les bras tendus en direction des pieds.

2. Gardez les abdominaux contractés et le bas du dos en contact avec le sol.

3. Relevez le haut du corps en direction des pieds en contractant les abdominaux.

4. Marquez un léger temps d''arrêt en position haute lorsque les mains se rapprochent des pieds.

5. Redescendez lentement les épaules jusqu''au sol en contrôlant le mouvement.

6. Répétez le mouvement sans utiliser d''élan afin de maximiser le travail de la sangle abdominale.','INTERMEDIATE','ISOLATION'),
                                                                           (65,'Crunch à la machine','1. Installez-vous sur la machine à crunch, le dos contre le dossier et placez vos pieds correctement sur les supports.

2. Positionnez vos bras sur les poignées et gardez les abdominaux légèrement contractés avant de commencer.

3. Enroulez lentement le buste vers l''avant en rapprochant les côtes du bassin grâce à la contraction des abdominaux.

4. Marquez un léger temps d''arrêt en position basse afin de maximiser la contraction musculaire.

5. Revenez lentement à la position de départ en contrôlant la remontée de la charge.

6. Répétez le mouvement sans tirer avec les bras afin de concentrer l''effort sur les abdominaux.','INTERMEDIATE','ISOLATION'),
                                                                           (67,'Crunch bicyclette','1. Allongez-vous sur le dos, les mains derrière la tête et les jambes relevées avec les genoux fléchis.

2. Contractez les abdominaux et décollez légèrement les épaules du sol.

3. Amenez alternativement un coude vers le genou opposé tout en tendant l''autre jambe.

4. Effectuez le mouvement lentement en réalisant une rotation du buste plutôt qu''un simple mouvement des bras.

5. Revenez progressivement à la position initiale entre chaque répétition.

6. Répétez le mouvement en gardant le bas du dos en contact avec le sol afin de maximiser le travail des abdominaux.','INTERMEDIATE','ISOLATION'),
                                                                           (74,'Adducteurs assis à la machine','1. Asseyez-vous sur la machine à adducteurs, le dos bien plaqué contre le dossier et les pieds positionnés sur les supports.

2. Réglez l''écartement des supports afin d''obtenir une amplitude confortable tout en gardant une bonne stabilité.

3. Gardez le buste droit et contractez légèrement les abdominaux avant de commencer le mouvement.

4. Rapprochez lentement les cuisses l''une vers l''autre en contractant les muscles adducteurs, tout en contrôlant la charge.

5. Marquez un léger temps d''arrêt en position fermée afin de maximiser la contraction musculaire.

6. Revenez lentement à la position de départ en contrôlant l''ouverture des jambes, sans relâcher brutalement la tension.','BEGINNER','ISOLATION'),
                                                                           (85,'Sit up machine','1. Installez-vous sur la machine à abdominaux, le dos bien positionné contre le support et les pieds correctement placés.

2. Saisissez les poignées ou placez les bras sur les supports prévus, puis contractez légèrement les abdominaux avant de commencer.

3. Enroulez lentement le buste vers l''avant en rapprochant la cage thoracique du bassin grâce à la contraction des abdominaux.

4. Marquez un léger temps d''arrêt en position basse afin de maximiser la contraction musculaire.

5. Revenez lentement à la position de départ en contrôlant la remontée de la charge.

6. Répétez le mouvement sans tirer avec les bras afin de concentrer l''effort sur les muscles abdominaux.','INTERMEDIATE','ISOLATION'),
                                                                           (97,'Extension lombaire','1. Installez-vous sur le banc à extension lombaire avec les pieds bloqués et les hanches positionnées sur le support.

2. Gardez le dos droit et les abdominaux légèrement contractés en position de départ.

3. Descendez lentement le buste vers l''avant en effectuant une flexion contrôlée du bassin.

4. Remontez le buste jusqu''à l''alignement du corps en contractant les lombaires et les fessiers.

5. Marquez un léger temps d''arrêt en position haute sans chercher à hypercambrer le dos.

6. Répétez le mouvement en gardant une amplitude contrôlée afin de renforcer la chaîne postérieure.','INTERMEDIATE','ISOLATION'),
                                                                           (135,'Curl biceps alterné à l’élastique','1. Placez-vous debout, les pieds écartés à la largeur des épaules, avec un élastique sous les pieds et une extrémité dans chaque main en prise supination.

2. Gardez le dos droit, les coudes proches du corps et les épaules fixes pendant toute l''exécution du mouvement.

3. Pliez un coude pour ramener une main vers l''épaule en contractant le biceps, sans utiliser l''élan du corps.

4. Redescendez lentement le bras tout en contrôlant la tension de l''élastique, puis effectuez le même mouvement avec l''autre bras.

5. Alternez les bras à chaque répétition en gardant les coudes fixes et le mouvement contrôlé afin de maintenir une tension constante sur les biceps.','BEGINNER','ISOLATION'),
                                                                           (136,'Curl de concentration à l’élastique','1. Asseyez-vous et fixez l’élastique sous un pied, puis saisissez son extrémité avec la main du même côté en prise supination.

2. Placez le coude contre l’intérieur de la cuisse en gardant le bras presque tendu et le buste légèrement incliné vers l’avant.

3. Pliez le coude pour ramener la main vers l’épaule en contractant le biceps, sans décoller le coude de la cuisse.

4. Marquez un léger temps d’arrêt en position haute tout en conservant la contraction du biceps.

5. Redescendez lentement la main jusqu’à l’extension presque complète du bras en contrôlant la tension de l’élastique.','BEGINNER','ISOLATION'),
                                                                           (137,'Curl biceps sur banc incliné ventral','1. Réglez un banc incliné et allongez-vous à plat ventre dessus, les pieds bien ancrés au sol et la poitrine en contact avec le dossier.

2. Saisissez une barre avec une prise en supination, les paumes vers le haut, et laissez les bras pendre vers le sol en gardant les coudes proches du corps.

3. Pliez les coudes pour remonter la barre vers les épaules en contractant les biceps, sans décoller la poitrine du banc ni utiliser l''élan du corps.

4. Marquez un léger temps d''arrêt en position haute tout en conservant la contraction des biceps.

5. Redescendez lentement la barre jusqu''à l''extension presque complète des bras en contrôlant la charge.

6. Répétez le mouvement en gardant les coudes fixes et les épaules stables afin de maintenir la tension sur les biceps.','INTERMEDIATE','ISOLATION'),
                                                                           (138,'Curl biceps prise serrée à la poulie','1. Placez-vous debout face à la poulie basse, les pieds écartés à la largeur des épaules, et saisissez la poignée avec une prise serrée en supination.

2. Gardez le dos droit, les coudes proches du corps et les épaules fixes pendant toute l''exécution du mouvement.

3. Pliez les coudes pour ramener la poignée vers le haut de l''abdomen ou la poitrine en contractant les biceps, sans utiliser l''élan du corps.

4. Marquez un léger temps d''arrêt en position haute tout en conservant la contraction des biceps.

5. Redescendez lentement la poignée jusqu''à l''extension presque complète des bras en contrôlant la tension du câble.

6. Répétez le mouvement en gardant les coudes fixes afin de maintenir une tension constante sur les biceps.','BEGINNER','ISOLATION');
INSERT INTO public.exercises (id,name,description,difficulty,mechanic) VALUES
                                                                           (139,'Curl marteau à la poulie','1. Placez-vous debout face à la poulie basse, les pieds écartés à la largeur des épaules, et saisissez la poignée avec une prise neutre, paume tournée vers l''intérieur.

2. Gardez le dos droit, les coudes proches du corps et les épaules fixes pendant toute l''exécution du mouvement.

3. Pliez les coudes pour ramener la poignée vers l''épaule en contractant le biceps et le brachial, sans utiliser l''élan du corps.

4. Marquez un léger temps d''arrêt en position haute tout en conservant la contraction musculaire.

5. Redescendez lentement la poignée jusqu''à l''extension presque complète du bras en contrôlant la tension du câble.

6. Répétez le mouvement en gardant les coudes fixes afin de maintenir une tension constante sur les muscles sollicités.','BEGINNER','ISOLATION'),
                                                                           (140,'Curl inversé à la poulie','1. Placez-vous debout face à la poulie basse et saisissez la barre avec une prise en pronation, les paumes vers le bas, les mains écartées à la largeur des épaules.

2. Gardez le dos droit, les coudes proches du corps et les épaules fixes pendant toute l''exécution du mouvement.

3. Pliez les coudes pour remonter la barre vers les épaules en contractant les biceps et les muscles de l''avant-bras, sans utiliser l''élan du corps.

4. Marquez un léger temps d''arrêt en position haute tout en conservant la contraction musculaire.

5. Redescendez lentement la barre jusqu''à l''extension presque complète des bras en contrôlant la tension de la poulie.

6. Répétez le mouvement en gardant les coudes fixes et les poignets dans l''alignement des avant-bras.','BEGINNER','ISOLATION'),
                                                                           (141,'Curl marteau au pupitre','1. Asseyez-vous au pupitre et placez l''arrière de vos bras contre le support, en saisissant la barre avec une prise neutre, les paumes face à face.

2. Gardez les bras fermement appuyés contre le pupitre et les épaules fixes pendant toute l''exécution du mouvement.

3. Pliez les coudes pour remonter la barre vers les épaules en contractant les biceps, sans décoller les bras du support.

4. Marquez un léger temps d''arrêt en position haute tout en conservant la contraction des muscles sollicités.

5. Redescendez lentement la barre jusqu''à l''extension presque complète des bras en contrôlant la charge.

6. Répétez le mouvement en gardant les coudes fixes et les poignets dans une position neutre afin de limiter l''intervention des épaules.','BEGINNER','ISOLATION'),
                                                                           (142,'Curl drag à la poulie','1. Placez-vous debout, dos à la poulie basse, et saisissez la poignée avec une prise en supination, le câble passant derrière vous.

2. Gardez le dos droit, la poitrine sortie et les coudes légèrement en arrière du buste pendant toute l''exécution du mouvement.

3. Pliez les coudes pour ramener les mains vers les épaules en les laissant reculer naturellement derrière le corps, tout en contractant les biceps.

4. Marquez un léger temps d''arrêt en position haute afin de maximiser la contraction des biceps.

5. Redescendez lentement les mains en contrôlant la tension du câble jusqu''à l''extension presque complète des bras.

6. Répétez le mouvement en gardant les coudes stables et en évitant d''utiliser l''élan du corps.','INTERMEDIATE','ISOLATION'),
                                                                           (106,'Pompes archer','1. Placez-vous en position de pompe, les mains écartées plus largement que les épaules et le corps gainé, aligné de la tête aux pieds.

2. Fléchissez un coude en descendant la poitrine vers cette main tout en gardant l''autre bras presque tendu sur le côté.

3. Descendez de manière contrôlée jusqu''à rapprocher la poitrine de la main du côté travaillé, sans laisser les hanches s''affaisser.

4. Poussez sur le bras fléchi pour revenir à la position de départ, puis effectuez le mouvement de l''autre côté.

5. Alternez les côtés à chaque répétition en gardant le corps gainé et en contrôlant l''ensemble du mouvement.','ADVANCED','COMPOUND'),
                                                                           (107,'Dips assistés pour les pectoraux à genoux','1. Agenouillez-vous sur la plateforme d''assistance et saisissez les barres parallèles avec une prise ferme, les bras tendus et le buste légèrement incliné vers l''avant.

2. Gardez les épaules basses, la poitrine sortie et le tronc gainé pendant toute l''exécution du mouvement.

3. Fléchissez lentement les coudes pour descendre le corps en laissant les épaules partir légèrement vers l''avant, jusqu''à obtenir un étirement confortable des pectoraux.

4. Marquez un léger temps d''arrêt en position basse tout en gardant le contrôle du mouvement.

5. Poussez sur les poignées pour remonter le corps en contractant les pectoraux, jusqu''à retrouver les bras presque tendus.

6. Répétez le mouvement de manière contrôlée en laissant la plateforme assister la remontée selon le niveau d''assistance choisi.','BEGINNER','COMPOUND'),
                                                                           (108,'Développé couché élastiques','1. Allongez-vous sur un banc plat, les pieds bien à plat au sol et les omoplates légèrement serrées.

2. Saisissez la barre avec une prise légèrement plus large que les épaules, puis positionnez-la au-dessus de la poitrine, les bras presque tendus. Placez l''élastique de manière à ce qu''il augmente progressivement la résistance lors de la montée.

3. Descendez lentement la barre vers la poitrine en fléchissant les coudes, tout en gardant les avant-bras relativement verticaux et les épaules stables.

4. Marquez un léger temps d''arrêt lorsque la barre atteint la poitrine, sans perdre la tension musculaire.

5. Poussez la barre vers le haut en contractant les pectoraux jusqu''à l''extension presque complète des bras, en contrôlant la résistance croissante de l''élastique.

6. Répétez le mouvement en gardant les pieds au sol, le bassin stable et une trajectoire contrôlée de la barre.','INTERMEDIATE','COMPOUND'),
                                                                           (109,'Développé décliné à la barre','1. Allongez-vous sur un banc décliné, les pieds fermement bloqués sous les supports et les omoplates légèrement serrées.

2. Saisissez la barre avec une prise légèrement plus large que les épaules, puis positionnez-la au-dessus de la poitrine, les bras presque tendus.

3. Descendez lentement la barre vers le bas des pectoraux en fléchissant les coudes, tout en gardant les avant-bras relativement verticaux et les épaules stables.

4. Marquez un léger temps d''arrêt lorsque la barre atteint le bas de la poitrine, sans rebondir sur celle-ci.

5. Poussez la barre vers le haut en contractant les pectoraux jusqu''à l''extension presque complète des bras, sans verrouiller brutalement les coudes.

6. Répétez le mouvement en gardant le bassin, le haut du dos et la tête en contact avec le banc, avec une trajectoire contrôlée de la barre.','INTERMEDIATE','COMPOUND'),
                                                                           (111,'Développé couché à la poulie','1. Allongez-vous sur un banc plat, les pieds bien à plat au sol et les omoplates légèrement serrées.

2. Saisissez une poignée dans chaque main avec une prise neutre ou légèrement pronée, puis positionnez les mains de part et d''autre de la poitrine, les bras presque tendus.

3. Descendez lentement les poignées en fléchissant les coudes jusqu''à ce qu''elles arrivent au niveau de la poitrine, tout en gardant les avant-bras relativement verticaux.

4. Marquez un léger temps d''arrêt en bas du mouvement tout en conservant le contrôle des poignées et la poitrine sortie.

5. Poussez les poignées vers le haut en contractant les pectoraux jusqu''à l''extension presque complète des bras, sans verrouiller brutalement les coudes.

6. Répétez le mouvement en gardant les poignées sous contrôle et en maintenant une trajectoire stable et symétrique.','INTERMEDIATE','COMPOUND'),
                                                                           (112,'Écarté décliné à la poulie','1. Allongez-vous sur un banc décliné, les pieds fermement bloqués sous les supports et les omoplates légèrement serrées.

2. Saisissez une poignée dans chaque main avec une prise neutre, puis positionnez les bras écartés de part et d''autre de la poitrine, les coudes légèrement fléchis.

3. Ramenez lentement les poignées l''une vers l''autre au-dessus de la poitrine en effectuant un mouvement d''arc, tout en gardant une légère flexion des coudes.

4. Marquez un léger temps d''arrêt lorsque les poignées se rapprochent au-dessus de la poitrine, en contractant les pectoraux.

5. Écartez progressivement les bras jusqu''à retrouver la position de départ, en contrôlant la tension des câbles et sans laisser les bras partir brutalement en arrière.

6. Répétez le mouvement en gardant les épaules stables et les coudes légèrement fléchis pendant toute l''exécution.','INTERMEDIATE','ISOLATION');
INSERT INTO public.exercises (id,name,description,difficulty,mechanic) VALUES
                                                                           (113,'Écarté couché à la poulie','1. Allongez-vous sur un banc plat, les pieds bien à plat au sol et les omoplates légèrement serrées.

2. Saisissez une poignée dans chaque main avec une prise neutre, puis tendez les bras au-dessus de la poitrine en gardant les coudes légèrement fléchis.

3. Écartez lentement les bras sur les côtés en effectuant un mouvement d''arc, jusqu''à obtenir un étirement confortable des pectoraux.

4. Marquez un léger temps d''arrêt en position basse tout en conservant le contrôle des poignées et la légère flexion des coudes.

5. Ramenez les poignées l''une vers l''autre au-dessus de la poitrine en contractant les pectoraux, sans modifier l''angle des coudes.

6. Répétez le mouvement de manière contrôlée en gardant les épaules stables et les bras légèrement fléchis pendant toute l''exécution.','INTERMEDIATE','ISOLATION'),
                                                                           (114,'Développé assis à la poulie','1. Asseyez-vous sur le siège de la machine ou du banc, les pieds bien à plat au sol et le dos fermement appuyé contre le dossier.

2. Saisissez une poignée dans chaque main avec une prise neutre ou légèrement pronée, puis positionnez-les de part et d''autre de la poitrine, les coudes fléchis.

3. Poussez les poignées vers l''avant en contractant les pectoraux jusqu''à l''extension presque complète des bras, sans verrouiller brutalement les coudes.

4. Marquez un léger temps d''arrêt en position haute tout en conservant la tension dans les pectoraux.

5. Ramenez lentement les poignées vers la poitrine en fléchissant les coudes, jusqu''à obtenir un étirement confortable des pectoraux.

6. Répétez le mouvement en gardant le dos contre le dossier, les épaules basses et le mouvement contrôlé.','BEGINNER','COMPOUND'),
                                                                           (176,'Rouleau de poignets','1. Tenez le rouleau de poignets à deux mains, les bras tendus devant vous à hauteur des épaules.

2. Enroulez la corde autour de l''axe du rouleau en faisant tourner alternativement les poignets afin de faire monter la charge.

3. Gardez les bras immobiles et concentrez le mouvement sur les poignets et les avant-bras.

4. Une fois la charge arrivée en haut, déroulez lentement la corde en effectuant le mouvement inverse et en contrôlant la descente.','BEGINNER','ISOLATION'),
                                                                           (115,'Pompes déclinées','1. Placez-vous en position de pompe avec les pieds surélevés sur un support stable et les mains posées au sol légèrement plus larges que les épaules.

2. Gardez le corps gainé et aligné de la tête aux pieds, avec les abdominaux contractés et les épaules stables.

3. Descendez lentement la poitrine vers le sol en fléchissant les coudes, tout en gardant les coudes légèrement orientés vers l''arrière.

4. Marquez un léger temps d''arrêt en position basse lorsque la poitrine se rapproche du sol, sans perdre l''alignement du corps.

5. Poussez sur les mains en contractant les pectoraux pour revenir à la position de départ, jusqu''à l''extension presque complète des bras.

6. Répétez le mouvement de manière contrôlée en maintenant les hanches alignées avec les épaules et les pieds.','INTERMEDIATE','COMPOUND'),
                                                                           (116,'Développé couché décliné aux haltères','1. Allongez-vous sur un banc décliné, les pieds fermement bloqués sous les supports et les omoplates légèrement serrées.

2. Saisissez un haltère dans chaque main avec une prise neutre ou légèrement pronée, puis positionnez-les de part et d''autre de la poitrine, les bras presque tendus.

3. Descendez lentement les haltères vers le bas de la poitrine en fléchissant les coudes, tout en gardant les avant-bras relativement verticaux.

4. Marquez un léger temps d''arrêt en bas du mouvement tout en conservant le contrôle des haltères et en gardant la poitrine sortie.

5. Poussez les haltères vers le haut en contractant les pectoraux jusqu''à l''extension presque complète des bras, sans verrouiller brutalement les coudes.

6. Répétez le mouvement en gardant une trajectoire contrôlée et symétrique, sans laisser les haltères s''entrechoquer en haut du mouvement.','INTERMEDIATE','COMPOUND'),
                                                                           (117,'Pompes inclinées','1. Placez vos mains sur un support stable légèrement plus haut que le sol, écartées à une largeur légèrement supérieure à celle des épaules.

2. Reculez les pieds afin de vous placer en position de pompe, le corps gainé et aligné de la tête aux pieds.

3. Descendez lentement la poitrine vers le support en fléchissant les coudes, tout en gardant les coudes légèrement orientés vers l''arrière.

4. Marquez un léger temps d''arrêt lorsque la poitrine se rapproche du support, sans perdre l''alignement du corps.

5. Poussez sur les mains en contractant les pectoraux pour revenir à la position de départ, jusqu''à l''extension presque complète des bras.

6. Répétez le mouvement de manière contrôlée en maintenant les hanches alignées avec les épaules et les jambes.','BEGINNER','COMPOUND'),
                                                                           (118,'Développé couché machine Smith','1. Allongez-vous sur un banc plat placé au centre de la machine Smith, les pieds bien à plat au sol et les omoplates légèrement serrées.

2. Saisissez la barre avec une prise légèrement plus large que les épaules, puis positionnez-la au-dessus de la poitrine, les bras presque tendus.

3. Décrochez la barre et descendez-la lentement vers le milieu de la poitrine en fléchissant les coudes, tout en gardant les avant-bras relativement verticaux.

4. Marquez un léger temps d''arrêt lorsque la barre atteint la poitrine, sans rebondir sur celle-ci.

5. Poussez la barre vers le haut en contractant les pectoraux jusqu''à l''extension presque complète des bras, sans verrouiller brutalement les coudes.

6. Répétez le mouvement en gardant les épaules stables, le haut du dos en contact avec le banc et une trajectoire contrôlée de la barre.','INTERMEDIATE','COMPOUND'),
                                                                           (119,'Développé décliné machine Smith','1. Allongez-vous sur un banc décliné placé au centre de la machine Smith, les pieds fermement bloqués sous les supports et les omoplates légèrement serrées.

2. Saisissez la barre avec une prise légèrement plus large que les épaules, puis positionnez-la au-dessus du bas de la poitrine, les bras presque tendus.

3. Décrochez la barre et descendez-la lentement vers le bas de la poitrine en fléchissant les coudes, tout en gardant les avant-bras relativement verticaux.

4. Marquez un léger temps d''arrêt lorsque la barre atteint la poitrine, sans rebondir sur celle-ci.

5. Poussez la barre vers le haut en contractant les pectoraux jusqu''à l''extension presque complète des bras, sans verrouiller brutalement les coudes.

6. Répétez le mouvement en gardant le haut du dos en contact avec le banc, les épaules stables et une trajectoire contrôlée de la barre.','INTERMEDIATE','COMPOUND'),
                                                                           (120,'Développé incliné machine Smith','1. Allongez-vous sur un banc incliné placé au centre de la machine Smith, les pieds bien à plat au sol et les omoplates légèrement serrées.

2. Saisissez la barre avec une prise légèrement plus large que les épaules, puis positionnez-la au-dessus du haut de la poitrine, les bras presque tendus.

3. Décrochez la barre et descendez-la lentement vers le haut de la poitrine en fléchissant les coudes, tout en gardant les avant-bras relativement verticaux.

4. Marquez un léger temps d''arrêt lorsque la barre atteint le haut de la poitrine, sans rebondir sur celle-ci.

5. Poussez la barre vers le haut en contractant les pectoraux jusqu''à l''extension presque complète des bras, sans verrouiller brutalement les coudes.

6. Répétez le mouvement en gardant le haut du dos et le bassin en contact avec le banc, les épaules stables et une trajectoire contrôlée de la barre.','INTERMEDIATE','COMPOUND'),
                                                                           (121,'Écarté incliné à la poulie','1. Allongez-vous sur un banc incliné, les pieds bien à plat au sol et les omoplates légèrement serrées.

2. Saisissez une poignée dans chaque main avec une prise neutre, puis tendez les bras au-dessus de la poitrine, les coudes légèrement fléchis.

3. Écartez lentement les bras sur les côtés en effectuant un mouvement d''arc, jusqu''à obtenir un étirement confortable des pectoraux.

4. Marquez un léger temps d''arrêt en position basse tout en conservant le contrôle des poignées et la légère flexion des coudes.

5. Ramenez les poignées l''une vers l''autre au-dessus de la partie supérieure de la poitrine en contractant les pectoraux, sans modifier l''angle des coudes.

6. Répétez le mouvement en gardant les épaules stables et les bras légèrement fléchis pendant toute l''exécution.','INTERMEDIATE','COMPOUND');
INSERT INTO public.exercises (id,name,description,difficulty,mechanic) VALUES
                                                                           (122,'Pompes claquées','1. Placez-vous en position de pompe, les mains légèrement plus larges que les épaules, les bras tendus et le corps aligné de la tête aux pieds.

2. Descendez rapidement en fléchissant les coudes tout en gardant le tronc gainé et les épaules stables.

3. Poussez explosivement sur le sol afin de décoller les mains tout en maintenant le corps aligné.

4. Effectuez un claquement de mains pendant la phase aérienne, puis replacez rapidement les mains dans leur position initiale.

5. Amortissez la réception en fléchissant légèrement les coudes, puis enchaînez immédiatement avec la répétition suivante en conservant un mouvement contrôlé.','ADVANCED','COMPOUND'),
                                                                           (177,'Flexion inversée des poignets à la barre','1. Asseyez-vous et posez vos avant-bras sur vos cuisses ou sur un banc, les mains dépassant légèrement des genoux, avec la barre en prise pronation.

2. Gardez les avant-bras immobiles et laissez les poignets descendre lentement vers le sol afin d''étirer les muscles de l''avant-bras.

3. Relevez les mains en effectuant une extension des poignets, sans décoller les avant-bras de leur support.

4. Redescendez lentement la charge en contrôlant le mouvement, puis répétez.','BEGINNER','ISOLATION'),
                                                                           (79,'Écartés poulie basse','1. Placez-vous debout au centre d''une poulie vis-à-vis avec les poignées réglées en position basse, puis saisissez une poignée dans chaque main.

2. Avancez légèrement un pied devant l''autre, inclinez légèrement le buste vers l''avant et gardez les épaules basses.

3. En conservant une légère flexion des coudes, ramenez les poignées vers le haut et vers l''avant en effectuant un mouvement d''arc.

4. Marquez un léger temps d''arrêt lorsque les mains se rapprochent devant votre poitrine afin de contracter les pectoraux.

5. Revenez lentement à la position de départ en contrôlant l''étirement des pectoraux.

6. Répétez le mouvement en gardant les coudes légèrement fléchis afin de maximiser le travail des muscles pectoraux.','INTERMEDIATE','ISOLATION'),
                                                                           (36,'Écartés poulie','1. Placez-vous debout au centre d''une poulie vis-à-vis avec les poignées réglées en position haute, puis saisissez une poignée dans chaque main.

2. Avancez légèrement un pied devant l''autre, inclinez légèrement le buste vers l''avant et gardez le dos droit avec les épaules basses.

3. En conservant une légère flexion des coudes, ramenez les poignées vers l''avant en effectuant un mouvement d''arc jusqu''à les rapprocher devant votre poitrine.

4. Marquez un léger temps d''arrêt en position de contraction maximale tout en serrant les pectoraux.

5. Revenez lentement à la position de départ en contrôlant l''ouverture des bras sans laisser la charge tirer brutalement les épaules.

6. Répétez le mouvement en gardant les coudes légèrement fléchis et en vous concentrant sur l''étirement et la contraction des pectoraux.','INTERMEDIATE','COMPOUND'),
                                                                           (143,'Curl biceps au pupitre à la poulie','1. Asseyez-vous face à la poulie basse et placez l''arrière de vos bras contre le pupitre, en saisissant la poignée ou la barre avec une prise en supination.

2. Gardez les bras fermement appuyés contre le pupitre et les épaules fixes pendant toute l''exécution du mouvement.

3. Pliez les coudes pour ramener la poignée ou la barre vers les épaules en contractant les biceps, sans décoller les bras du support.

4. Marquez un léger temps d''arrêt en position haute tout en conservant la contraction des biceps.

5. Redescendez lentement la charge jusqu''à l''extension presque complète des bras en contrôlant la tension du câble, sans verrouiller brutalement les coudes.

6. Répétez le mouvement en gardant les bras appuyés contre le pupitre afin de limiter l''intervention des épaules.','BEGINNER','ISOLATION'),
                                                                           (144,'Curl biceps sur banc incliné à la poulie','1. Placez un banc incliné face à deux poulies basses et asseyez-vous dos aux poulies, les pieds bien à plat au sol.

2. Saisissez une poignée dans chaque main avec une prise en supination, puis laissez les bras descendre naturellement derrière le corps.

3. Gardez le dos et les épaules contre le banc, les coudes légèrement en arrière du buste et les épaules fixes pendant toute l''exécution du mouvement.

4. Pliez les coudes pour ramener les poignées vers les épaules en contractant les biceps, sans décoller le dos du banc.

5. Marquez un léger temps d''arrêt en position haute tout en conservant la contraction des biceps.

6. Redescendez lentement les poignées jusqu''à l''extension presque complète des bras en contrôlant la tension des câbles, puis répétez le mouvement.','INTERMEDIATE','ISOLATION'),
                                                                           (123,'Traction archer','1. Suspendez-vous à une barre de traction avec une prise en pronation, les mains écartées au-delà de la largeur des épaules et les bras tendus.

2. Gainez le corps et tirez-vous vers le haut en dirigeant votre poitrine vers une main, tout en gardant l''autre bras progressivement tendu.

3. Continuez à monter jusqu''à amener votre poitrine près de la main qui effectue principalement la traction, en gardant les épaules basses et le mouvement contrôlé.

4. Redescendez lentement jusqu''à retrouver la position de départ, puis effectuez le mouvement vers l''autre côté.

5. Alternez les côtés à chaque répétition en maintenant le corps gainé et en évitant les mouvements de balancier.','ADVANCED','COMPOUND'),
                                                                           (124,'Traction assistée assis','1. Placez-vous sur la plateforme de la machine à tractions assistées et saisissez la barre avec une prise légèrement plus large que les épaules.

2. Gardez le buste droit, les épaules basses et les bras tendus en position de départ, en maintenant les genoux ou les pieds sur le support prévu à cet effet.

3. Tirez votre corps vers le haut en abaissant les coudes vers le bas et vers l''arrière, tout en contractant les dorsaux.

4. Marquez un léger temps d''arrêt en position haute lorsque le menton approche du niveau de la barre, sans hausser les épaules.

5. Redescendez lentement jusqu''à l''extension presque complète des bras en contrôlant la charge et en conservant la tension musculaire.

6. Répétez le mouvement sans utiliser d''élan, en laissant la machine fournir uniquement l''assistance nécessaire pour réaliser le mouvement correctement.','BEGINNER','COMPOUND'),
                                                                           (125,'Haussement d''épaules à l''élastique','1. Placez-vous debout, les pieds écartés à la largeur des épaules, et tenez un élastique dans chaque main ou saisissez ses extrémités en le maintenant sous les pieds.

2. Gardez les bras tendus le long du corps, le dos droit et les épaules relâchées en position de départ.

3. Haussez les épaules vers les oreilles en contractant les trapèzes, sans plier les coudes ni faire rouler les épaules.

4. Marquez un léger temps d''arrêt en position haute tout en maintenant la contraction des trapèzes.

5. Redescendez lentement les épaules jusqu''à la position de départ en contrôlant la tension de l''élastique.

6. Répétez le mouvement en gardant le buste immobile et en évitant d''utiliser l''élan.','BEGINNER','ISOLATION'),
                                                                           (126,'Tirage latéral à la poulie','1. Asseyez-vous face à la poulie haute et saisissez la poignée avec une prise en pronation, le bras tendu au-dessus de la tête.

2. Gardez le buste droit, les épaules basses et le tronc gainé pendant toute l''exécution du mouvement.

3. Tirez la poignée vers le haut de la poitrine en abaissant le coude vers le côté du corps, tout en gardant l''épaule stable.

4. Marquez un léger temps d''arrêt en position basse en contractant le grand dorsal, sans incliner excessivement le buste.

5. Remontez lentement la poignée jusqu''à l''extension presque complète du bras en contrôlant la charge.

6. Répétez le mouvement en maintenant une trajectoire fluide et en évitant de tirer avec l''élan du corps.','BEGINNER','COMPOUND');
INSERT INTO public.exercises (id,name,description,difficulty,mechanic) VALUES
                                                                           (127,'Tirage arrière à la poulie','1. Asseyez-vous face à la poulie haute et saisissez la barre avec une prise en pronation légèrement plus large que les épaules.

2. Gardez le buste droit, la poitrine sortie et les épaules basses pendant toute l''exécution du mouvement.

3. Tirez la barre vers le haut de la poitrine en abaissant les coudes vers le bas et vers l''arrière, sans incliner excessivement le buste.

4. Marquez un léger temps d''arrêt en position basse en contractant les dorsaux, tout en conservant le contrôle de la charge.

5. Remontez lentement la barre jusqu''à l''extension presque complète des bras en laissant les épaules s''élever naturellement.

6. Répétez le mouvement en gardant le buste stable et en évitant de tirer avec l''élan du corps.','BEGINNER','COMPOUND'),
                                                                           (128,'Tirage vertical serré à l''élastique','1. Fixez l''élastique en hauteur et placez-vous face au point d''ancrage, les pieds écartés à la largeur des épaules.

2. Saisissez l''élastique avec une prise serrée, les paumes face à face, puis tendez les bras au-dessus de la tête en gardant le buste droit.

3. Tirez l''élastique vers le haut de la poitrine en abaissant les coudes vers le bas et vers l''arrière, tout en gardant les épaules basses.

4. Marquez un léger temps d''arrêt en position basse en contractant les dorsaux, sans tirer avec l''élan du corps.

5. Remontez lentement les mains jusqu''à la position de départ en laissant les bras se tendre progressivement et en conservant la tension de l''élastique.

6. Répétez le mouvement de manière contrôlée en gardant le buste stable afin de maximiser le travail des muscles du dos.','BEGINNER','COMPOUND'),
                                                                           (129,'Rowing incliné à la barre','1. Placez-vous debout, les pieds écartés à la largeur des épaules, et saisissez la barre avec une prise légèrement plus large que les épaules.

2. Fléchissez légèrement les genoux et inclinez le buste vers l''avant en gardant le dos droit, jusqu''à former un angle d''environ 45 degrés avec le sol.

3. Tirez la barre vers le bas de votre poitrine en ramenant les coudes vers l''arrière, tout en gardant les épaules basses et le buste immobile.

4. Marquez un léger temps d''arrêt en position haute en contractant les muscles du dos, sans hausser les épaules.

5. Redescendez lentement la barre jusqu''à l''extension des bras en contrôlant la charge et en maintenant la position du buste.

6. Répétez le mouvement sans utiliser d''élan afin de maximiser le travail des muscles du dos.','INTERMEDIATE','COMPOUND'),
                                                                           (130,'Tirage vertical à la poulie','1. Asseyez-vous face à la poulie haute, les pieds bien à plat au sol et les cuisses maintenues sous les supports afin de stabiliser le corps.

2. Saisissez la barre avec une prise légèrement plus large que les épaules, puis tendez les bras au-dessus de la tête en gardant le buste droit.

3. Tirez la barre vers le haut de votre poitrine en abaissant les coudes vers le bas et vers l''arrière, tout en gardant les épaules basses et la poitrine légèrement sortie.

4. Marquez un léger temps d''arrêt en position basse en contractant les dorsaux, sans tirer la barre derrière la nuque.

5. Remontez lentement la barre jusqu''à la position de départ en laissant les bras se tendre progressivement et en conservant le contrôle de la charge.

6. Répétez le mouvement en gardant le buste stable et en évitant de tirer principalement avec les bras afin de maximiser le travail des muscles du dos.','BEGINNER','COMPOUND'),
                                                                           (131,'Tirage horizontal haut à la poulie','1. Asseyez-vous face à la poulie, les pieds bien à plat sur les supports et le buste droit. Saisissez les poignées avec une prise neutre, les bras tendus devant vous.

2. Gardez la poitrine légèrement sortie, les épaules basses et le dos droit pendant toute l''exécution du mouvement.

3. Tirez les poignées vers le haut de la poitrine en ramenant les coudes vers l''arrière et légèrement vers l''extérieur, tout en rapprochant les omoplates.

4. Marquez un léger temps d''arrêt en position contractée en gardant les épaules basses et le buste immobile.

5. Revenez lentement à la position de départ en laissant les bras se tendre progressivement, sans relâcher brutalement la tension musculaire.

6. Répétez le mouvement de manière contrôlée afin de maximiser le travail des muscles du haut du dos et des deltoïdes postérieurs.','BEGINNER','COMPOUND'),
                                                                           (132,'Rowing incliné aux haltères','1. Placez un banc à environ 30 à 45 degrés et allongez-vous dessus à plat ventre, les pieds bien stables au sol.

2. Saisissez un haltère dans chaque main avec une prise neutre et laissez les bras tendus vers le sol, les épaules basses.

3. Tirez les haltères vers les côtés de votre poitrine en ramenant les coudes vers l''arrière et en rapprochant les omoplates.

4. Marquez un léger temps d''arrêt en position haute en contractant les muscles du dos, sans hausser les épaules.

5. Redescendez lentement les haltères jusqu''à l''extension des bras en contrôlant la charge et en conservant la position du buste.

6. Répétez le mouvement de manière contrôlée sans utiliser d''élan afin de maximiser le travail des muscles du dos.','BEGINNER','COMPOUND'),
                                                                           (133,'Rowing buste penché','1. Placez-vous debout face à la machine à levier, les pieds écartés à la largeur des épaules et le buste incliné vers l''avant en gardant le dos droit.

2. Saisissez les poignées avec une prise neutre et gardez les bras tendus devant vous, les épaules relâchées mais contrôlées.

3. Tirez les poignées vers votre abdomen en ramenant les coudes vers l''arrière et en rapprochant les omoplates, sans arrondir le dos.

4. Marquez un léger temps d''arrêt en position haute en contractant les muscles du dos, tout en gardant le buste stable.

5. Revenez lentement à la position de départ en laissant les bras se tendre progressivement et en contrôlant la charge.

6. Répétez le mouvement sans utiliser d''élan afin de maintenir la tension sur les muscles du dos.','INTERMEDIATE','COMPOUND'),
                                                                           (134,'Rowing buste penché à la Smith machine','1. Placez-vous debout face à la barre de la Smith machine, les pieds écartés à la largeur des épaules, puis saisissez la barre avec une prise en pronation légèrement plus large que les épaules.

2. Déverrouillez la barre et inclinez le buste vers l''avant en fléchissant légèrement les genoux, tout en gardant le dos droit et les abdominaux gainés.

3. Tirez la barre vers le bas de votre abdomen en ramenant les coudes vers l''arrière et en rapprochant les omoplates.

4. Marquez un léger temps d''arrêt en position haute en contractant les muscles du dos, sans redresser le buste.

5. Redescendez lentement la barre jusqu''à la position de départ en contrôlant la charge et en laissant les bras se tendre progressivement.

6. Répétez le mouvement en gardant le dos stable et en évitant d''utiliser l''élan du corps.','INTERMEDIATE','COMPOUND'),
                                                                           (93,'Traction assistée debout','1. Placez-vous sur la machine à tractions assistées et saisissez les poignées avec une prise adaptée.

2. Positionnez vos genoux ou vos pieds sur le support d''assistance, puis gardez le corps gainé et les bras tendus.

3. Tirez votre corps vers le haut en ramenant les coudes vers le bas jusqu''à rapprocher votre poitrine de la barre.

4. Marquez un léger temps d''arrêt en position haute en contractant les muscles du dos.

5. Redescendez lentement jusqu''à l''extension complète des bras en contrôlant l''assistance.

6. Répétez le mouvement en gardant une exécution contrôlée afin de progresser vers les tractions au poids du corps.','BEGINNER','COMPOUND'),
                                                                           (89,'Rowing barre buste penché','1. Placez-vous debout avec une barre dans les mains, les pieds écartés à la largeur des épaules et les genoux légèrement fléchis.

2. Inclinez le buste vers l''avant en gardant le dos droit, la poitrine sortie et les abdominaux contractés.

3. Tirez la barre vers votre abdomen en ramenant les coudes vers l''arrière tout en gardant le buste immobile.

4. Marquez un léger temps d''arrêt en position haute afin de contracter les muscles du dos.

5. Redescendez lentement la barre jusqu''à l''extension complète des bras en contrôlant la charge.

6. Répétez le mouvement sans utiliser d''élan afin de maximiser le travail des dorsaux et des trapèzes.','INTERMEDIATE','COMPOUND');
INSERT INTO public.exercises (id,name,description,difficulty,mechanic) VALUES
                                                                           (145,'Dips assistés','1. Installez-vous sur la machine à dips assistés et placez les genoux ou les pieds sur la plateforme prévue à cet effet, selon le modèle de machine.

2. Saisissez fermement les poignées avec les bras presque tendus et gardez le buste droit, les épaules basses et les coudes légèrement fléchis.

3. Descendez lentement en fléchissant les coudes jusqu''à ce que les bras atteignent une amplitude confortable, sans laisser les épaules remonter excessivement.

4. Poussez sur les poignées en contractant les triceps afin de revenir à la position de départ, sans verrouiller brutalement les coudes.

5. Répétez le mouvement de manière contrôlée en maintenant une trajectoire stable et en laissant la machine fournir l''assistance nécessaire.','BEGINNER','COMPOUND'),
                                                                           (146,'Développé incliné prise serrée à la barre','1. Allongez-vous sur un banc incliné, les pieds bien à plat au sol et les omoplates légèrement serrées.

2. Saisissez la barre avec une prise serrée, légèrement plus étroite que la largeur des épaules, puis positionnez-la au-dessus de la partie supérieure de la poitrine, les bras presque tendus.

3. Descendez lentement la barre vers le haut de la poitrine en fléchissant les coudes, tout en gardant ceux-ci proches du corps.

4. Marquez un léger temps d''arrêt en bas du mouvement en conservant le contrôle de la barre et une position stable des épaules.

5. Poussez la barre vers le haut en contractant les triceps et les pectoraux jusqu''à l''extension presque complète des bras, sans verrouiller brutalement les coudes.

6. Répétez le mouvement de manière contrôlée en maintenant les poignets alignés avec les avant-bras et la trajectoire de la barre stable.','INTERMEDIATE','COMPOUND'),
                                                                           (147,'Extension triceps au-dessus de la tête à la barre','1. Asseyez-vous sur un banc avec le dos droit et les pieds bien à plat au sol, puis saisissez la barre avec une prise légèrement plus étroite que la largeur des épaules.

2. Amenez la barre au-dessus de votre tête, les bras presque tendus, en gardant les coudes dirigés vers l''avant et proches de la tête.

3. Descendez lentement la barre derrière la tête en fléchissant les coudes, tout en gardant les bras supérieurs relativement immobiles.

4. Marquez un léger temps d''arrêt en position basse en conservant le contrôle de la barre et un étirement des triceps.

5. Tendez les coudes pour ramener la barre au-dessus de la tête en contractant les triceps, sans verrouiller brutalement les coudes.

6. Répétez le mouvement de manière contrôlée en maintenant le buste stable et les coudes dans une position fixe.','INTERMEDIATE','ISOLATION'),
                                                                           (148,'Dips au sol','1. Asseyez-vous au sol devant un banc stable et placez vos mains sur le bord du banc, légèrement plus écartées que la largeur des épaules.

2. Avancez les pieds et soulevez les hanches afin de placer le poids du corps sur les mains, en gardant les jambes tendues ou légèrement fléchies.

3. Descendez lentement le corps vers le sol en fléchissant les coudes, tout en gardant le dos proche du banc et les épaules basses.

4. Poussez sur les mains en contractant les triceps pour remonter le corps jusqu''à l''extension presque complète des bras.

5. Répétez le mouvement de manière contrôlée en gardant les coudes orientés vers l''arrière et le banc stable.','BEGINNER','COMPOUND'),
                                                                           (149,'Extension triceps à la poulie sur banc incliné','1. Installez un banc incliné face à une poulie basse et allongez-vous dessus en tenant la poignée de la poulie à deux mains, les bras tendus au-dessus de la tête.

2. Gardez les bras relativement fixes et les coudes orientés vers l''avant, sans les laisser s''écarter excessivement.

3. Fléchissez les coudes pour ramener la poignée derrière ou au-dessus de la tête, en contrôlant la descente et en étirant les triceps.

4. Tendez les coudes pour ramener la poignée à la position de départ en contractant fortement les triceps, sans bouger les épaules.

5. Répétez le mouvement de manière contrôlée en maintenant une tension constante sur les triceps.','INTERMEDIATE','ISOLATION'),
                                                                           (150,'Pompes prise serrée','1. Placez-vous en position de pompe, les mains rapprochées sous la poitrine, légèrement plus serrées que la largeur des épaules.

2. Gardez le corps aligné de la tête aux pieds, les abdominaux et les fessiers contractés.

3. Fléchissez les coudes en les maintenant relativement proches du corps afin de descendre la poitrine vers le sol de manière contrôlée.

4. Poussez sur les mains pour tendre les bras et revenir à la position de départ, en contractant fortement les triceps.

5. Répétez le mouvement sans laisser les hanches s''affaisser ni utiliser d''élan.','INTERMEDIATE','COMPOUND'),
                                                                           (151,'Extension triceps avec haltères sur banc incliné','1. Allongez-vous sur un banc incliné, un haltère dans chaque main, les bras tendus au-dessus de la poitrine et les paumes face à face.

2. Gardez les bras relativement fixes et les coudes orientés vers l''avant pendant toute l''exécution du mouvement.

3. Fléchissez les coudes pour descendre lentement les haltères de chaque côté de la tête, en contrôlant l''étirement des triceps.

4. Tendez les coudes pour ramener les haltères à la position de départ en contractant les triceps, sans bouger excessivement les épaules.

5. Répétez le mouvement de manière contrôlée en maintenant les coudes stables et proches de leur position initiale.','INTERMEDIATE','ISOLATION'),
                                                                           (152,'Développé couché aux haltères prise serrée','1. Allongez-vous sur un banc avec un haltère dans chaque main, les paumes face à face et les bras tendus au-dessus de la poitrine.

2. Gardez les bras relativement fixes et les coudes proches du corps pendant toute l''exécution du mouvement.

3. Fléchissez les coudes pour abaisser lentement les haltères vers les épaules, sans laisser les bras supérieurs se déplacer excessivement.

4. Marquez une courte pause en bas du mouvement, puis tendez les coudes pour repousser les haltères vers la position de départ en contractant les triceps.

5. Effectuez chaque répétition de manière contrôlée, en gardant les deux haltères alignés et les poignets stables.','INTERMEDIATE','ISOLATION'),
                                                                           (153,'Extension triceps assis avec haltère','1. Asseyez-vous sur un banc, le dos droit, en tenant un haltère à deux mains au-dessus de la tête, les bras tendus.

2. Gardez les coudes orientés vers l''avant et proches de la tête pendant toute l''exécution du mouvement.

3. Fléchissez lentement les coudes pour descendre l''haltère derrière la tête, sans bouger excessivement les épaules.

4. Tendez les coudes pour ramener l''haltère à la position de départ en contractant les triceps.

5. Répétez le mouvement de manière contrôlée en gardant le dos stable et les coudes dans une position fixe.','BEGINNER','ISOLATION'),
                                                                           (154,'Pompes en équilibre sur les mains','1. Placez-vous en équilibre sur les mains, idéalement contre un mur pour sécuriser la position, les bras tendus et le corps aligné.

2. Contractez les abdominaux et les fessiers afin de maintenir une position stable et évitez de cambrer excessivement le dos.

3. Fléchissez lentement les coudes pour descendre la tête vers le sol en gardant les coudes relativement proches du corps.

4. Lorsque la tête atteint une profondeur confortable, poussez fortement dans les mains pour tendre les bras et revenir à la position de départ.

5. Gardez le mouvement contrôlé et maintenez l''alignement du corps pendant toute la répétition.','ADVANCED','COMPOUND');
INSERT INTO public.exercises (id,name,description,difficulty,mechanic) VALUES
                                                                           (156,'Rowing à la barre','1. Placez-vous debout, les pieds écartés à la largeur des épaules, et tenez une barre avec une prise pronation légèrement plus large que les épaules.

2. Inclinez le buste vers l''avant en gardant le dos droit, les genoux légèrement fléchis et la tête dans l''alignement de la colonne.

3. Tirez la barre vers le haut de la poitrine en écartant les coudes sur les côtés afin de solliciter principalement les deltoïdes postérieurs.

4. Marquez une courte pause en position haute en contractant les deltoïdes postérieurs, puis redescendez lentement la barre en contrôlant le mouvement.

5. Répétez le mouvement sans utiliser d''élan et en maintenant le buste stable pendant toute l''exécution.','INTERMEDIATE','COMPOUND'),
                                                                           (157,'Développé militaire assis à la barre','1. Asseyez-vous sur un banc avec dossier, les pieds bien ancrés au sol, et saisissez la barre légèrement plus large que la largeur des épaules.

2. Positionnez la barre devant le haut de la poitrine, les coudes légèrement sous les poignets et le dos en contact avec le dossier.

3. Poussez la barre vers le haut en tendant les bras, sans hausser excessivement les épaules ni cambrer le bas du dos.

4. Une fois les bras presque tendus, redescendez lentement la barre jusqu''au niveau du haut de la poitrine en contrôlant le mouvement.

5. Répétez le mouvement en maintenant le buste stable et les poignets alignés avec les avant-bras.','INTERMEDIATE','COMPOUND'),
                                                                           (158,'Développé militaire debout à la barre, prise large','1. Placez-vous debout, les pieds écartés à la largeur des épaules, et saisissez la barre avec une prise plus large que la largeur des épaules.

2. Positionnez la barre devant le haut de la poitrine, les coudes légèrement sous les poignets et le tronc gainé.

3. Poussez la barre verticalement au-dessus de la tête en tendant les bras, tout en gardant les abdominaux contractés et en évitant de cambrer excessivement le dos.

4. Une fois les bras presque tendus, redescendez lentement la barre jusqu''au niveau du haut de la poitrine en contrôlant le mouvement.

5. Répétez le mouvement en maintenant le corps stable et les poignets alignés avec les avant-bras.','INTERMEDIATE','COMPOUND'),
                                                                           (159,'Thruster à la barre','1. Placez la barre sur l''avant des épaules, les pieds écartés à la largeur des épaules et les coudes légèrement relevés.

2. Fléchissez les genoux et les hanches pour descendre en position de squat, en gardant le dos droit et les genoux alignés avec les pieds.

3. Remontez de manière explosive en poussant dans les jambes et utilisez cet élan pour commencer à pousser la barre au-dessus de la tête.

4. Tendez les bras au-dessus de la tête tout en terminant l''extension des hanches et des genoux.

5. Redescendez la barre vers les épaules de manière contrôlée, puis enchaînez directement avec la répétition suivante.','ADVANCED','COMPOUND'),
                                                                           (160,'Cordes ondulatoires','1. Placez-vous debout, les pieds écartés à la largeur des épaules, les genoux légèrement fléchis et saisissez une extrémité de la corde dans chaque main.

2. Gardez le dos droit, le tronc gainé et les épaules relâchées tout en maintenant une légère flexion des coudes.

3. Levez rapidement un bras tout en abaissant l''autre afin de créer des ondulations successives dans la corde.

4. Alternez les mouvements des bras à un rythme régulier en utilisant principalement les épaules et les bras, sans effectuer de mouvements excessifs avec le dos.

5. Maintenez une cadence constante pendant toute la durée de l''exercice en gardant le tronc stable.','INTERMEDIATE','COMPOUND'),
                                                                           (161,'Élévation latérale à la poulie','1. Placez-vous debout à côté d''une poulie basse et saisissez la poignée avec la main opposée à la poulie.

2. Gardez le dos droit, le bras légèrement fléchi et le coude dans une position stable.

3. Élevez le bras sur le côté jusqu''à environ la hauteur des épaules, en gardant la main et le coude dans un mouvement naturel.

4. Marquez une courte pause en position haute en contractant le deltoïde moyen, puis redescendez lentement le bras en contrôlant la tension du câble.

5. Répétez le mouvement sans utiliser d''élan et en gardant le buste immobile.','BEGINNER','ISOLATION'),
                                                                           (162,'Écarté inversé croisé à la poulie haute','1. Placez-vous debout entre deux poulies hautes et saisissez chaque poignée avec la main opposée au câble, les bras croisés devant vous.

2. Gardez le dos droit, le tronc gainé et les coudes légèrement fléchis pendant toute l''exécution du mouvement.

3. Écartez les bras vers l''extérieur et légèrement vers l''arrière en rapprochant les omoplates, jusqu''à ce que les bras soient alignés avec les épaules.

4. Marquez une courte pause en position ouverte en contractant les deltoïdes postérieurs, puis revenez lentement à la position de départ.

5. Gardez le mouvement contrôlé et évitez d''utiliser l''élan du corps afin de maintenir la tension sur les épaules.','INTERMEDIATE','ISOLATION'),
                                                                           (163,'Élévation en T avec haltères sur banc incliné','1. Allongez-vous à plat ventre sur un banc incliné, un haltère dans chaque main, les bras tendus vers le sol et les paumes face à face.

2. Gardez le buste et la tête stables, les coudes légèrement fléchis et les épaules relâchées.

3. Élevez simultanément les bras sur les côtés jusqu''à former un T avec le corps, en rapprochant légèrement les omoplates.

4. Marquez une courte pause en position haute en contractant les deltoïdes postérieurs, puis redescendez lentement les haltères.

5. Répétez le mouvement de manière contrôlée sans utiliser d''élan ni hausser excessivement les épaules.','BEGINNER','ISOLATION'),
                                                                           (164,'Écarté inversé avec haltères','1. Placez-vous debout, les pieds écartés à la largeur des épaules, et penchez le buste vers l''avant en gardant le dos droit. Tenez un haltère dans chaque main, les bras légèrement fléchis.

2. Laissez les haltères pendre sous la poitrine, les paumes face à face, et gardez les épaules basses.

3. Élevez simultanément les bras sur les côtés jusqu''à les aligner avec les épaules, en dirigeant le mouvement avec les coudes.

4. Marquez une courte pause en position haute en contractant les deltoïdes postérieurs, puis redescendez lentement les haltères.

5. Répétez le mouvement de manière contrôlée sans utiliser d''élan ni hausser les épaules.','BEGINNER','ISOLATION'),
                                                                           (165,'Écarté inversé assis à la machine','1. Asseyez-vous face au dossier de la machine, la poitrine contre le support, et saisissez les poignées avec les bras légèrement fléchis.

2. Gardez le dos droit, le buste stable et les épaules basses pendant toute l''exécution du mouvement.

3. Écartez les bras vers l''arrière jusqu''à les aligner avec les épaules, en dirigeant le mouvement avec les coudes.

4. Marquez une courte pause en position ouverte en contractant les deltoïdes postérieurs, puis revenez lentement à la position de départ.

5. Répétez le mouvement de manière contrôlée sans utiliser d''élan ni hausser les épaules.','BEGINNER','ISOLATION');
INSERT INTO public.exercises (id,name,description,difficulty,mechanic) VALUES
                                                                           (166,'Épaulé-jeté à la barre','1. Placez la barre au sol devant vous, les pieds écartés à la largeur des épaules, puis saisissez-la avec une prise légèrement plus large que les épaules.

2. Gardez le dos droit et le tronc gainé, puis poussez dans les jambes pour décoller la barre du sol en la gardant proche du corps.

3. Effectuez une extension explosive des hanches et des genoux pour amener la barre sur l''avant des épaules, puis réceptionnez-la en fléchissant légèrement les genoux.

4. Depuis cette position, poussez fortement dans les jambes pour propulser la barre au-dessus de la tête tout en tendant les bras.

5. Stabilisez la barre au-dessus de la tête, puis redescendez-la de manière contrôlée avant de recommencer la répétition.','ADVANCED','COMPOUND'),
                                                                           (167,'Soulevé de terre à la barre','1. Placez la barre au sol devant vous, les pieds écartés à la largeur des hanches, puis saisissez-la avec les mains juste à l’extérieur des jambes.

2. Fléchissez légèrement les genoux et poussez les hanches vers l’arrière en gardant le dos droit et le tronc gainé.

3. Poussez dans les pieds et tendez les hanches et les genoux pour soulever la barre en la gardant proche du corps.

4. Une fois debout, terminez l’extension des hanches sans vous pencher excessivement vers l’arrière.

5. Repoussez les hanches vers l’arrière et fléchissez les genoux pour redescendre la barre au sol de manière contrôlée, en maintenant le dos droit.','INTERMEDIATE','COMPOUND'),
                                                                           (168,'Squat avant à la barre','1. Placez la barre sur l''avant des épaules, les coudes relevés et les mains positionnées légèrement plus larges que les épaules.

2. Placez les pieds environ à la largeur des épaules, gainez le tronc et gardez le dos droit.

3. Fléchissez les hanches et les genoux pour descendre en squat, en gardant les coudes hauts et les genoux alignés avec les pieds.

4. Descendez jusqu''à une profondeur confortable en maintenant le buste aussi droit que possible.

5. Poussez dans les pieds pour remonter en tendant les genoux et les hanches, puis répétez le mouvement de manière contrôlée.','INTERMEDIATE','COMPOUND'),
                                                                           (169,'Hip thrust à la barre','1. Asseyez-vous au sol devant un banc, le haut du dos contre le bord du banc, les genoux fléchis et les pieds à plat sur le sol.

2. Placez une barre rembourrée sur les hanches et maintenez-la avec les mains pour éviter qu''elle ne glisse.

3. Contractez les abdominaux et poussez dans les pieds pour soulever les hanches jusqu''à ce que le buste et les cuisses soient alignés.

4. Marquez une courte pause en position haute en contractant fortement les fessiers, sans cambrer excessivement le bas du dos.

5. Redescendez lentement les hanches jusqu''à la position de départ, puis répétez le mouvement de manière contrôlée.','INTERMEDIATE','COMPOUND'),
                                                                           (170,'Leg curl allongé à la machine','1. Allongez-vous à plat ventre sur la machine, les chevilles placées sous les rouleaux et les jambes tendues.

2. Gardez les hanches et le buste bien en contact avec le support, les mains sur les poignées et les jambes parallèles.

3. Fléchissez les genoux pour ramener les rouleaux vers les fessiers en contractant les ischio-jambiers, sans décoller les hanches du support.

4. Marquez une courte pause en position haute, puis redescendez lentement les jambes en contrôlant la charge.

5. Répétez le mouvement sans utiliser d''élan et en maintenant une tension constante sur les ischio-jambiers.','BEGINNER','ISOLATION'),
                                                                           (171,'Extension des mollets assis à la machine','1. Asseyez-vous sur la machine, placez l''avant des pieds sur la plateforme et positionnez les coussins sur le bas des cuisses, juste au-dessus des genoux.

2. Gardez les genoux fixes et saisissez les poignées de la machine pour stabiliser le haut du corps.

3. Poussez sur l''avant des pieds pour élever les talons aussi haut que possible en contractant les mollets.

4. Marquez une courte pause en position haute, puis abaissez lentement les talons pour étirer les mollets.

5. Répétez le mouvement de manière contrôlée en conservant une amplitude complète.','BEGINNER','ISOLATION'),
                                                                           (172,'Extension des mollets debout à la machine','1. Placez-vous debout sur la plateforme de la machine, les épaules sous les coussinets et les pieds parallèles, avec les talons dans le vide.

2. Gardez les jambes tendues sans verrouiller excessivement les genoux et maintenez le dos droit pendant toute l''exécution.

3. Descendez lentement les talons vers le bas afin d''étirer les mollets tout en contrôlant la charge.

4. Poussez sur l''avant des pieds pour élever les talons le plus haut possible en contractant les mollets.

5. Redescendez progressivement et répétez le mouvement sans utiliser d''élan.','BEGINNER','ISOLATION'),
                                                                           (173,'Extension de hanche penché à l’élastique','1. Fixez l''élastique derrière vous à un point bas et placez l''autre extrémité autour de vos hanches. Reculez pour créer une tension dans l''élastique.

2. Penchez le buste vers l''avant en gardant le dos droit et les genoux légèrement fléchis.

3. Poussez les hanches vers l''avant en contractant les fessiers jusqu''à revenir en position debout, sans cambrer excessivement le bas du dos.

4. Revenez lentement à la position de départ en laissant les hanches reculer tout en contrôlant la tension de l''élastique.

5. Gardez le mouvement centré sur les hanches et maintenez le dos stable pendant toute l''exécution.','BEGINNER','ISOLATION'),
                                                                           (174,'Extension de hanche debout à la poulie','1. Fixez la sangle de la poulie basse autour d''une cheville et placez-vous face à la machine en vous tenant à un support pour garder l''équilibre.

2. Gardez le buste droit, la jambe d''appui légèrement fléchie et les abdominaux gainés.

3. Amenez la jambe équipée de la sangle vers l''arrière en contractant le fessier, sans cambrer le bas du dos ni tourner le bassin.

4. Revenez lentement à la position de départ en contrôlant la charge et en gardant la tension sur le câble.

5. Effectuez toutes les répétitions avec une amplitude contrôlée, puis changez de jambe.','BEGINNER','ISOLATION'),
                                                                           (175,'Retourner de pneu','1. Placez-vous face au pneu, les pieds écartés à la largeur des épaules et les genoux légèrement fléchis.

2. Accroupissez-vous et saisissez le bord inférieur du pneu avec les mains, en gardant le dos droit et la poitrine relevée.

3. Poussez fortement dans les jambes tout en tirant le pneu vers vous afin de le faire basculer.

4. Lorsque le pneu commence à monter, avancez les hanches et les épaules pour poursuivre le mouvement et amenez un genou contre le pneu si nécessaire.

5. Saisissez le haut du pneu et poussez-le vers l''avant avec les bras jusqu''à le faire complètement basculer.

6. Laissez le pneu retomber de manière contrôlée, puis repositionnez-vous pour la répétition suivante.','ADVANCED','COMPOUND');
INSERT INTO public.exercises (id,name,description,difficulty,mechanic) VALUES
                                                                           (178,'Burpee','1. Placez-vous debout, les pieds écartés à la largeur des épaules et les bras le long du corps.

2. Accroupissez-vous puis posez les mains au sol devant vous.

3. Envoyez les pieds vers l''arrière pour vous retrouver en position de planche, en gardant le corps gainé.

4. Ramenez rapidement les pieds vers les mains puis relevez-vous en poussant dans les jambes.

5. Effectuez un saut vertical en levant les bras au-dessus de la tête, puis atterrissez de manière contrôlée avant d''enchaîner la répétition suivante.','INTERMEDIATE','COMPOUND'),
                                                                           (179,'Corde à sauter','1. Tenez les poignées de la corde à sauter, les coudes légèrement fléchis et les bras proches du corps.

2. Placez-vous debout, les pieds joints ou légèrement écartés, avec le dos droit et le regard vers l''avant.

3. Faites tourner la corde principalement avec les poignets et sautez légèrement lorsque celle-ci passe sous vos pieds.

4. Gardez les sauts bas et réguliers, en atterrissant souplement sur l''avant des pieds.

5. Maintenez un rythme constant en gardant les épaules détendues et les mouvements contrôlés.','BEGINNER','COMPOUND'),
                                                                           (180,'Marche sur escalier mécanique','1. Montez sur le stepmill et placez-vous droit, en gardant le regard vers l''avant et le tronc légèrement gainé.

2. Commencez à monter les marches à un rythme régulier, en posant chaque pied de manière stable sur une marche.

3. Gardez une posture naturelle et évitez de vous suspendre aux poignées ; utilisez-les uniquement pour maintenir votre équilibre si nécessaire.

4. Maintenez une cadence régulière pendant toute la durée de l''exercice en contrôlant chaque pas.','BEGINNER','COMPOUND'),
                                                                           (181,'Abdominaux à 3/4','1. Allongez-vous sur le dos, les genoux fléchis et les pieds à plat au sol, avec les mains derrière la tête ou croisées sur la poitrine.

2. Contractez les abdominaux et relevez le haut du corps jusqu''à environ trois quarts de la position assise, sans tirer sur la nuque.

3. Redescendez lentement jusqu''à ce que les épaules se rapprochent du sol, tout en gardant les abdominaux sous tension.

4. Répétez le mouvement de manière contrôlée, en évitant de donner de l''élan avec les bras ou les jambes.','BEGINNER','ISOLATION'),
                                                                           (182,'Flexion latérale à 45°','1. Placez-vous debout, le corps incliné à environ 45° sur le côté, en maintenant une position stable et le tronc gainé.

2. Gardez le bassin fixe et effectuez une flexion latérale du tronc en rapprochant le côté du buste de la hanche.

3. Revenez lentement à la position de départ en contrôlant le mouvement, sans utiliser d''élan.

4. Effectuez toutes les répétitions d''un côté avant de changer de côté, en gardant le mouvement fluide et maîtrisé.','INTERMEDIATE','ISOLATION'),
                                                                           (183,'Toucher alterné des talons','1. Allongez-vous sur le dos, les genoux fléchis et les pieds à plat au sol, légèrement écartés de la largeur des épaules.

2. Décollez légèrement les épaules du sol et gardez les abdominaux contractés.

3. Inclinez le buste sur le côté pour toucher votre talon droit avec la main droite.

4. Revenez au centre, puis inclinez le buste de l''autre côté pour toucher le talon gauche avec la main gauche.

5. Alternez les côtés à chaque répétition en gardant les mouvements contrôlés et les lombaires proches du sol.','BEGINNER','ISOLATION'),
                                                                           (184,'Déroulé à la roue abdominale debout','1. Placez-vous debout, les pieds écartés à la largeur des épaules, et saisissez fermement les poignées de la roue abdominale.

2. Gardez les bras tendus, les abdominaux fortement contractés et le bassin légèrement rentré.

3. Faites rouler la roue vers l''avant en inclinant progressivement le corps, tout en contrôlant la descente et en gardant le dos aligné.

4. Descendez jusqu''à l''amplitude que vous pouvez maîtriser sans creuser le bas du dos.

5. Contractez fortement les abdominaux et ramenez la roue vers vous pour revenir à la position de départ, sans utiliser d''élan.','ADVANCED','COMPOUND'),
                                                                           (185,'Déroulé à la roue abdominale à genoux','1. Agenouillez-vous au sol, saisissez fermement les poignées de la roue abdominale et placez-la devant vous.

2. Contractez les abdominaux, rentrez légèrement le bassin et gardez le dos aligné.

3. Faites rouler la roue vers l''avant en tendant progressivement les bras et en contrôlant l''extension du corps, sans creuser le bas du dos.

4. Descendez jusqu''à l''amplitude que vous pouvez maîtriser tout en maintenant les abdominaux sous tension.

5. Contractez fortement les abdominaux et ramenez la roue vers vous pour revenir à la position de départ, sans utiliser d''élan.','INTERMEDIATE','COMPOUND'),
                                                                           (186,'Développé assis sur machine à levier','1. Asseyez-vous sur la machine, le dos bien plaqué contre le dossier et les pieds fermement posés au sol.

2. Saisissez les poignées avec une prise adaptée à la machine, les coudes légèrement sous ou dans l''alignement des épaules.

3. Poussez les poignées vers l''avant en contractant les pectoraux, sans décoller le dos du dossier.

4. Tendez les bras sans verrouiller brutalement les coudes, puis ramenez lentement les poignées vers vous en contrôlant la charge.

5. Gardez les épaules basses et le mouvement fluide afin de maintenir une tension constante sur les pectoraux.','BEGINNER','COMPOUND'),
                                                                           (187,'Crunch décliné','1. Allongez-vous sur un banc décliné, les pieds fermement maintenus et les genoux légèrement fléchis.

2. Placez les mains derrière la tête ou croisées sur la poitrine, puis contractez les abdominaux pour stabiliser le bassin.

3. Enroulez progressivement le haut du dos en rapprochant la cage thoracique du bassin, sans tirer sur la nuque.

4. Marquez une courte pause en position haute en contractant les abdominaux, puis redescendez lentement en contrôlant le mouvement.

5. Gardez le bas du dos en contact avec le banc et évitez de donner de l''élan avec les bras ou les jambes.','INTERMEDIATE','ISOLATION');
INSERT INTO public.exercises (id,name,description,difficulty,mechanic) VALUES
                                                                           (188,'Drapeau','1. Placez-vous allongé sur le côté d''un support vertical solide et saisissez-le fermement avec les deux mains.

2. Engagez fortement les abdominaux et les obliques afin de maintenir le corps gainé et aligné.

3. Poussez avec le bras inférieur tout en tirant avec le bras supérieur pour soulever les jambes et le bassin du sol.

4. Maintenez le corps aussi droit que possible à l''horizontale, sans laisser les hanches s''affaisser.

5. Redescendez lentement et sous contrôle, puis répétez le mouvement en conservant une forte contraction de la sangle abdominale.','ADVANCED','ISOLATION'),
                                                                           (189,'Coude-genou','1. Allongez-vous sur le dos, les genoux fléchis et les pieds posés au sol. Placez les mains derrière la tête sans tirer sur la nuque.

2. Contractez les abdominaux et décollez légèrement les épaules du sol.

3. Ramenez un coude vers le genou opposé en effectuant une légère rotation du buste.

4. Revenez lentement à la position initiale, puis effectuez le mouvement de l''autre côté.

5. Alternez les côtés en gardant les abdominaux contractés et en contrôlant chaque répétition.','BEGINNER','ISOLATION'),
                                                                           (190,'Front lever','1. Suspendez-vous à une barre fixe avec une prise pronation, les bras tendus et les épaules engagées.

2. Contractez fortement les abdominaux, les fessiers et les jambes afin de maintenir le corps parfaitement gainé.

3. Tirez les épaules vers le bas et vers l''arrière, puis amenez progressivement le corps à l''horizontale en gardant les bras tendus.

4. Maintenez la position avec le corps aligné, sans laisser les hanches s''affaisser ni plier les coudes.

5. Redescendez lentement sous contrôle ou relâchez progressivement la position, puis répétez.','ADVANCED','ISOLATION'),
                                                                           (191,'Planche complète','1. Placez les mains au sol, légèrement plus écartées que la largeur des épaules, les doigts orientés vers l''avant.

2. Tendez complètement les bras et inclinez progressivement les épaules vers l''avant afin de transférer le poids du corps au-dessus des mains.

3. Décollez les pieds du sol et maintenez les jambes tendues, en gardant le corps parfaitement aligné de la tête aux pieds.

4. Contractez fortement les abdominaux, les fessiers et les jambes pour éviter que les hanches ne s''affaissent.

5. Maintenez la position aussi longtemps que possible avec les bras tendus, puis redescendez progressivement sous contrôle.','ADVANCED','ISOLATION'),
                                                                           (192,'Relevé de hanches et de jambes suspendu','1. Suspendez-vous à une barre fixe avec une prise pronation, les bras tendus et les jambes jointes.

2. Engagez les abdominaux et gardez les jambes tendues pendant toute l''exécution du mouvement.

3. Relevez les jambes vers l''avant en enroulant progressivement le bassin afin de rapprocher les hanches de la poitrine.

4. Montez aussi haut que possible en contractant fortement les abdominaux, sans utiliser d''élan.

5. Redescendez lentement les jambes jusqu''à la position initiale en gardant le mouvement contrôlé.','INTERMEDIATE','ISOLATION'),
                                                                           (193,'Relevé de genoux oblique suspendu','1. Suspendez-vous à une barre fixe avec une prise pronation, les bras tendus et les jambes jointes.

2. Contractez les abdominaux et gardez le haut du corps stable pendant toute l''exécution du mouvement.

3. Relevez les genoux vers la poitrine tout en les dirigeant vers un côté afin d''effectuer une rotation du bassin.

4. Montez aussi haut que possible en contractant les abdominaux et les obliques, sans utiliser d''élan.

5. Redescendez lentement les jambes, puis effectuez le mouvement du côté opposé en alternant les côtés à chaque répétition.','INTERMEDIATE','ISOLATION'),
                                                                           (194,'Pike suspendu','1. Suspendez-vous à une barre fixe avec les bras tendus et le corps gainé.

2. Contractez les abdominaux et relevez simultanément les jambes et le bassin vers l''avant afin d''amener les pieds vers la barre.

3. Montez les jambes aussi haut que possible en gardant les jambes tendues et en contrôlant le mouvement, sans vous balancer.

4. Redescendez lentement jusqu''à la position initiale en maintenant le gainage, puis répétez.','ADVANCED','ISOLATION'),
                                                                           (195,'Relevé de jambes tendues suspendu','1. Suspendez-vous à une barre fixe avec les bras tendus, les jambes jointes et le corps gainé.

2. Contractez les abdominaux puis relevez les jambes tendues vers l''avant en gardant les genoux verrouillés et en évitant de vous balancer.

3. Montez les jambes jusqu''à atteindre une position aussi haute que possible tout en gardant le mouvement contrôlé.

4. Redescendez lentement les jambes jusqu''à la position initiale sans relâcher complètement le gainage, puis répétez.','INTERMEDIATE','ISOLATION'),
                                                                           (196,'Sit-up jackknife','1. Allongez-vous sur le dos, les jambes tendues et les bras tendus derrière la tête.

2. Contractez les abdominaux pour relever simultanément le haut du corps et les jambes vers le centre du corps.

3. Amenez les mains vers les pieds en gardant les jambes aussi tendues que possible, puis contrôlez la descente.

4. Revenez lentement à la position initiale sans relâcher complètement les abdominaux, puis répétez.','INTERMEDIATE','COMPOUND'),
                                                                           (197,'Planche penchée','1. Placez-vous en position de planche, les mains au sol légèrement en avant des épaules et les bras tendus.

2. Contractez fortement les abdominaux, les fessiers et les jambes afin de maintenir le corps parfaitement gainé et aligné.

3. Projetez progressivement les épaules vers l''avant au-delà des mains en gardant les bras tendus et les coudes verrouillés.

4. Maintenez la position en contrôlant la tension sur les épaules et le tronc, sans creuser le bas du dos.

5. Revenez progressivement à la position initiale en conservant le gainage.','ADVANCED','COMPOUND');
INSERT INTO public.exercises (id,name,description,difficulty,mechanic) VALUES
                                                                           (198,'Frappe au marteau de forgeron','1. Placez-vous debout face à un pneu ou une surface adaptée, les pieds écartés à la largeur des épaules, en tenant le marteau à deux mains.

2. Levez le marteau au-dessus d''une épaule en gardant le tronc gainé et les genoux légèrement fléchis.

3. Frappez puissamment vers le bas en utilisant principalement la rotation du tronc et l''extension des bras.

4. Contrôlez le rebond ou l''impact du marteau, puis ramenez-le au-dessus de l''épaule opposée.

5. Alternez les côtés à chaque répétition en maintenant une posture stable et un mouvement contrôlé.','INTERMEDIATE','COMPOUND'),
                                                                           (92,'Tirage horizontal à la machine','1. Asseyez-vous sur la machine Low Row, placez vos pieds sur les supports et saisissez les poignées avec les deux mains.

2. Gardez le dos droit, la poitrine sortie et les épaules basses en position de départ.

3. Tirez les poignées vers votre abdomen en ramenant les coudes vers l''arrière et en rapprochant les omoplates.

4. Marquez un léger temps d''arrêt en fin de tirage afin de contracter les muscles du dos.

5. Revenez lentement à la position initiale en contrôlant la charge.

6. Répétez le mouvement en évitant de tirer uniquement avec les bras afin de maximiser le travail du dos.','BEGINNER','COMPOUND'),
                                                                           (44,'Hip thrust à la machine','1. Installez-vous au sol avec le haut du dos appuyé contre un banc, une barre positionnée sur le bassin et les pieds à plat au sol écartés à la largeur des hanches.

2. Gardez le menton légèrement rentré, le dos stable et les abdominaux contractés avant de commencer le mouvement.

3. Poussez dans vos pieds pour monter le bassin vers le haut en contractant fortement les fessiers jusqu''à aligner les épaules, les hanches et les genoux.

4. Marquez un léger temps d''arrêt en position haute en effectuant une contraction maximale des fessiers.

5. Redescendez lentement le bassin jusqu''à la position de départ en contrôlant la charge.

6. Répétez le mouvement en évitant de cambrer excessivement le dos afin de maximiser le travail des fessiers.','INTERMEDIATE','COMPOUND'),
                                                                           (82,'Développé couché au sol','1. Allongez-vous sur le sol, les genoux fléchis et les pieds bien à plat, avec un haltère dans chaque main au niveau de la poitrine.

2. Gardez les omoplates légèrement serrées et positionnez les coudes légèrement inclinés par rapport au corps.

3. Poussez les haltères vers le haut jusqu''à l''extension presque complète des bras en contractant les pectoraux.

4. Marquez un léger temps d''arrêt en position haute sans verrouiller brutalement les coudes.

5. Descendez lentement les haltères jusqu''à ce que vos triceps touchent légèrement le sol, tout en contrôlant la charge.

6. Répétez le mouvement en gardant une trajectoire stable afin de maximiser le travail des pectoraux et des triceps.','BEGINNER','COMPOUND'),
                                                                           (34,'Relevé de jambes à la machine','1. Allongez-vous sur le dos, les jambes tendues et les mains placées le long du corps ou sous les fessiers pour plus de stabilité.

2. Gardez le bas du dos en contact avec le sol et contractez les abdominaux avant de commencer le mouvement.

3. Relevez lentement les jambes vers le haut jusqu''à former un angle proche de 90° avec le buste.

4. Marquez un léger temps d''arrêt en position haute en contractant les abdominaux.

5. Redescendez lentement les jambes vers le sol en contrôlant le mouvement sans cambrer le dos.

6. Répétez le mouvement en gardant une exécution lente afin de maximiser le travail de la sangle abdominale.','INTERMEDIATE','ISOLATION');


INSERT INTO public.muscle_group VALUES (1, 'PECTORAUX');
INSERT INTO public.muscle_group VALUES (2, 'TRICEPS');
INSERT INTO public.muscle_group VALUES (3, 'JAMBES');
INSERT INTO public.muscle_group VALUES (4, 'EPAULES');
INSERT INTO public.muscle_group VALUES (5, 'DOS');
INSERT INTO public.muscle_group VALUES (6, 'BICEPS');
INSERT INTO public.muscle_group VALUES (7, 'ABDOMINAUX');
INSERT INTO public.muscle_group VALUES (8, 'CARDIO');


INSERT INTO public.muscles (id,muscle_group_id,name) VALUES
                                                         (3,3,'Quadriceps'),
                                                         (7,4,'Deltoïdes antérieurs'),
                                                         (8,4,'Deltoïdes moyens'),
                                                         (9,4,'Deltoïdes postérieurs'),
                                                         (10,5,'Trapèzes'),
                                                         (11,5,'Grand dorsal'),
                                                         (12,5,'Grand rond'),
                                                         (13,5,'Petit rond'),
                                                         (18,7,'Grand droit - Haut'),
                                                         (19,7,'Grand droit - Bas');
INSERT INTO public.muscles (id,muscle_group_id,name) VALUES
                                                         (21,7,'Transverse'),
                                                         (22,8,'Cardio'),
                                                         (23,8,'Tronc'),
                                                         (24,8,'Full body'),
                                                         (25,1,'Milieu des pectoraux'),
                                                         (26,1,'Bas des pectoraux'),
                                                         (1,1,'Haut des pectoraux'),
                                                         (27,2,'Chef latéral'),
                                                         (28,2,'Chef médial'),
                                                         (2,2,'Chef long');
INSERT INTO public.muscles (id,muscle_group_id,name) VALUES
                                                         (30,6,'Bracho-radial'),
                                                         (15,6,'Brachial'),
                                                         (16,6,'Biceps court'),
                                                         (17,6,'Biceps long'),
                                                         (31,3,'Soléaire'),
                                                         (4,3,'Ischio-jambier'),
                                                         (6,3,'Jumeau'),
                                                         (5,3,'Fessier'),
                                                         (14,5,'Lombaire'),
                                                         (20,7,'Oblique');
INSERT INTO public.muscles (id,muscle_group_id,name) VALUES
                                                         (32,3,'Adducteurs'),
                                                         (33,3,'Abducteurs');


INSERT INTO public.exercise_muscle (id,exercise_id,muscle_id) VALUES
                                                                  (477,2,1),
                                                                  (478,3,1),
                                                                  (479,5,2),
                                                                  (480,7,2),
                                                                  (481,9,3),
                                                                  (482,9,4),
                                                                  (483,9,5),
                                                                  (485,12,6),
                                                                  (486,13,8),
                                                                  (487,14,7);
INSERT INTO public.exercise_muscle (id,exercise_id,muscle_id) VALUES
                                                                  (489,16,11),
                                                                  (490,16,10),
                                                                  (491,17,11),
                                                                  (492,17,10),
                                                                  (493,18,11),
                                                                  (494,18,12),
                                                                  (495,21,15),
                                                                  (496,22,15),
                                                                  (497,23,18),
                                                                  (498,24,19);
INSERT INTO public.exercise_muscle (id,exercise_id,muscle_id) VALUES
                                                                  (499,25,18),
                                                                  (500,27,21),
                                                                  (501,28,22),
                                                                  (502,29,22),
                                                                  (505,30,22),
                                                                  (506,33,3),
                                                                  (507,33,4),
                                                                  (508,33,5),
                                                                  (509,33,6),
                                                                  (510,34,19);
INSERT INTO public.exercise_muscle (id,exercise_id,muscle_id) VALUES
                                                                  (511,40,1),
                                                                  (512,1,25),
                                                                  (513,4,25),
                                                                  (514,35,25),
                                                                  (515,36,25),
                                                                  (516,37,25),
                                                                  (517,38,25),
                                                                  (518,39,26),
                                                                  (519,41,3),
                                                                  (520,41,5);
INSERT INTO public.exercise_muscle (id,exercise_id,muscle_id) VALUES
                                                                  (521,41,4),
                                                                  (522,42,3),
                                                                  (523,43,4),
                                                                  (524,43,5),
                                                                  (525,44,5),
                                                                  (526,45,3),
                                                                  (527,45,5),
                                                                  (528,45,4),
                                                                  (529,46,3),
                                                                  (530,46,5);
INSERT INTO public.exercise_muscle (id,exercise_id,muscle_id) VALUES
                                                                  (531,47,3),
                                                                  (532,47,5),
                                                                  (533,47,4),
                                                                  (534,48,3),
                                                                  (535,48,5),
                                                                  (536,48,4),
                                                                  (537,6,28),
                                                                  (538,7,27),
                                                                  (539,7,28),
                                                                  (540,49,27);
INSERT INTO public.exercise_muscle (id,exercise_id,muscle_id) VALUES
                                                                  (541,49,28),
                                                                  (542,50,27),
                                                                  (543,8,27),
                                                                  (544,6,27),
                                                                  (545,51,8),
                                                                  (546,52,8),
                                                                  (547,53,7),
                                                                  (548,54,9),
                                                                  (550,16,12),
                                                                  (551,17,12);
INSERT INTO public.exercise_muscle (id,exercise_id,muscle_id) VALUES
                                                                  (552,55,11),
                                                                  (554,55,10),
                                                                  (555,55,11),
                                                                  (556,55,12),
                                                                  (557,56,11),
                                                                  (558,56,10),
                                                                  (559,56,12),
                                                                  (560,57,11),
                                                                  (561,57,10),
                                                                  (563,57,12);
INSERT INTO public.exercise_muscle (id,exercise_id,muscle_id) VALUES
                                                                  (564,57,13),
                                                                  (565,58,10),
                                                                  (566,19,16),
                                                                  (567,20,16),
                                                                  (568,21,30),
                                                                  (569,22,30),
                                                                  (570,59,16),
                                                                  (571,59,17),
                                                                  (572,60,16),
                                                                  (573,60,17);
INSERT INTO public.exercise_muscle (id,exercise_id,muscle_id) VALUES
                                                                  (574,61,16),
                                                                  (575,61,17),
                                                                  (576,62,16),
                                                                  (577,62,17),
                                                                  (578,19,17),
                                                                  (579,20,17),
                                                                  (580,24,21),
                                                                  (581,26,21),
                                                                  (585,64,19),
                                                                  (586,64,21);
INSERT INTO public.exercise_muscle (id,exercise_id,muscle_id) VALUES
                                                                  (587,65,18),
                                                                  (588,66,20),
                                                                  (589,66,21),
                                                                  (590,67,20),
                                                                  (591,67,18),
                                                                  (592,67,19),
                                                                  (593,67,20),
                                                                  (594,68,18),
                                                                  (595,68,19),
                                                                  (596,68,21);
INSERT INTO public.exercise_muscle (id,exercise_id,muscle_id) VALUES
                                                                  (597,27,20),
                                                                  (598,69,31),
                                                                  (599,71,2),
                                                                  (600,43,14),
                                                                  (601,72,3),
                                                                  (602,72,4),
                                                                  (603,72,5),
                                                                  (604,73,4),
                                                                  (605,74,32),
                                                                  (606,74,5);
INSERT INTO public.exercise_muscle (id,exercise_id,muscle_id) VALUES
                                                                  (607,75,33),
                                                                  (608,75,5),
                                                                  (609,76,10),
                                                                  (610,76,9),
                                                                  (611,76,11),
                                                                  (612,77,6),
                                                                  (613,78,4),
                                                                  (614,78,5),
                                                                  (615,79,26),
                                                                  (616,80,9);
INSERT INTO public.exercise_muscle (id,exercise_id,muscle_id) VALUES
                                                                  (617,81,15),
                                                                  (618,82,2),
                                                                  (619,82,28),
                                                                  (620,82,27),
                                                                  (627,85,18),
                                                                  (628,85,19),
                                                                  (629,86,11),
                                                                  (630,86,12),
                                                                  (631,87,12),
                                                                  (632,88,2);
INSERT INTO public.exercise_muscle (id,exercise_id,muscle_id) VALUES
                                                                  (633,88,28),
                                                                  (634,88,27),
                                                                  (635,89,11),
                                                                  (637,90,25),
                                                                  (638,91,10),
                                                                  (639,92,10),
                                                                  (640,92,11),
                                                                  (645,95,5),
                                                                  (646,94,7),
                                                                  (647,94,8);
INSERT INTO public.exercise_muscle (id,exercise_id,muscle_id) VALUES
                                                                  (648,93,11),
                                                                  (649,93,12),
                                                                  (651,97,14),
                                                                  (653,99,2),
                                                                  (654,100,22),
                                                                  (655,101,16),
                                                                  (656,101,17),
                                                                  (657,102,25),
                                                                  (658,102,1),
                                                                  (659,103,1);
INSERT INTO public.exercise_muscle (id,exercise_id,muscle_id) VALUES
                                                                  (662,105,15),
                                                                  (663,105,16),
                                                                  (664,105,17),
                                                                  (665,106,25),
                                                                  (666,107,26),
                                                                  (667,108,25),
                                                                  (668,109,26),
                                                                  (669,111,1),
                                                                  (670,112,26),
                                                                  (671,113,25);
INSERT INTO public.exercise_muscle (id,exercise_id,muscle_id) VALUES
                                                                  (672,114,25),
                                                                  (673,115,26),
                                                                  (674,116,26),
                                                                  (675,117,26),
                                                                  (676,118,25),
                                                                  (677,119,26),
                                                                  (678,120,1),
                                                                  (679,121,1),
                                                                  (680,122,25),
                                                                  (681,123,11);
INSERT INTO public.exercise_muscle (id,exercise_id,muscle_id) VALUES
                                                                  (682,123,12),
                                                                  (683,123,10),
                                                                  (684,124,11),
                                                                  (685,124,12),
                                                                  (686,124,10),
                                                                  (687,125,10),
                                                                  (688,126,11),
                                                                  (689,126,12),
                                                                  (690,127,11),
                                                                  (691,127,12);
INSERT INTO public.exercise_muscle (id,exercise_id,muscle_id) VALUES
                                                                  (692,127,10),
                                                                  (693,128,11),
                                                                  (694,128,12),
                                                                  (695,129,11),
                                                                  (696,129,12),
                                                                  (697,129,10),
                                                                  (698,129,14),
                                                                  (699,130,11),
                                                                  (700,130,12),
                                                                  (701,131,10);
INSERT INTO public.exercise_muscle (id,exercise_id,muscle_id) VALUES
                                                                  (702,131,11),
                                                                  (703,131,12),
                                                                  (704,131,13),
                                                                  (705,132,10),
                                                                  (706,132,11),
                                                                  (707,132,12),
                                                                  (708,133,10),
                                                                  (709,133,11),
                                                                  (710,133,12),
                                                                  (711,133,14);
INSERT INTO public.exercise_muscle (id,exercise_id,muscle_id) VALUES
                                                                  (712,134,10),
                                                                  (713,134,11),
                                                                  (714,134,12),
                                                                  (715,134,14),
                                                                  (749,135,15),
                                                                  (750,135,16),
                                                                  (751,135,17),
                                                                  (752,135,30),
                                                                  (753,136,15),
                                                                  (754,136,16);
INSERT INTO public.exercise_muscle (id,exercise_id,muscle_id) VALUES
                                                                  (755,136,17),
                                                                  (756,136,30),
                                                                  (757,137,15),
                                                                  (758,137,16),
                                                                  (759,137,17),
                                                                  (760,138,15),
                                                                  (761,138,16),
                                                                  (762,138,17),
                                                                  (763,139,15),
                                                                  (764,139,17);
INSERT INTO public.exercise_muscle (id,exercise_id,muscle_id) VALUES
                                                                  (765,139,30),
                                                                  (766,140,15),
                                                                  (767,140,16),
                                                                  (768,140,17),
                                                                  (769,140,30),
                                                                  (770,141,15),
                                                                  (771,141,16),
                                                                  (772,141,17),
                                                                  (773,141,30),
                                                                  (774,142,15);
INSERT INTO public.exercise_muscle (id,exercise_id,muscle_id) VALUES
                                                                  (775,142,16),
                                                                  (776,142,17),
                                                                  (777,142,30),
                                                                  (778,143,15),
                                                                  (779,143,16),
                                                                  (780,143,17),
                                                                  (781,143,30),
                                                                  (782,144,15),
                                                                  (783,144,16),
                                                                  (784,144,17);
INSERT INTO public.exercise_muscle (id,exercise_id,muscle_id) VALUES
                                                                  (785,144,30),
                                                                  (810,145,2),
                                                                  (811,145,27),
                                                                  (812,145,28),
                                                                  (813,146,2),
                                                                  (814,146,27),
                                                                  (815,146,28),
                                                                  (816,147,2),
                                                                  (817,147,27),
                                                                  (818,147,28);
INSERT INTO public.exercise_muscle (id,exercise_id,muscle_id) VALUES
                                                                  (819,148,2),
                                                                  (820,148,27),
                                                                  (821,148,28),
                                                                  (822,149,2),
                                                                  (823,149,27),
                                                                  (824,149,28),
                                                                  (825,150,2),
                                                                  (826,150,27),
                                                                  (827,150,28),
                                                                  (828,151,2);
INSERT INTO public.exercise_muscle (id,exercise_id,muscle_id) VALUES
                                                                  (829,151,27),
                                                                  (830,151,28),
                                                                  (831,152,2),
                                                                  (832,152,27),
                                                                  (833,152,28),
                                                                  (834,153,2),
                                                                  (835,153,27),
                                                                  (836,153,28),
                                                                  (837,154,2),
                                                                  (838,154,27);
INSERT INTO public.exercise_muscle (id,exercise_id,muscle_id) VALUES
                                                                  (839,154,28),
                                                                  (840,155,2),
                                                                  (841,155,27),
                                                                  (842,155,28),
                                                                  (843,156,9),
                                                                  (844,157,7),
                                                                  (845,157,8),
                                                                  (846,158,7),
                                                                  (847,158,8),
                                                                  (848,159,7);
INSERT INTO public.exercise_muscle (id,exercise_id,muscle_id) VALUES
                                                                  (849,159,8),
                                                                  (850,160,7),
                                                                  (851,160,8),
                                                                  (852,161,8),
                                                                  (853,162,9),
                                                                  (854,163,9),
                                                                  (855,164,9),
                                                                  (856,165,9),
                                                                  (857,166,3),
                                                                  (858,166,4);
INSERT INTO public.exercise_muscle (id,exercise_id,muscle_id) VALUES
                                                                  (859,166,5),
                                                                  (860,166,6),
                                                                  (861,167,3),
                                                                  (862,167,4),
                                                                  (863,167,5),
                                                                  (864,167,6),
                                                                  (865,168,3),
                                                                  (866,168,5),
                                                                  (867,168,32),
                                                                  (868,169,3);
INSERT INTO public.exercise_muscle (id,exercise_id,muscle_id) VALUES
                                                                  (869,169,4),
                                                                  (870,169,5),
                                                                  (871,170,4),
                                                                  (872,170,6),
                                                                  (873,171,31),
                                                                  (874,172,6),
                                                                  (875,172,31),
                                                                  (876,173,5),
                                                                  (877,173,4),
                                                                  (878,174,5);
INSERT INTO public.exercise_muscle (id,exercise_id,muscle_id) VALUES
                                                                  (879,175,3),
                                                                  (880,175,4),
                                                                  (881,175,5),
                                                                  (882,176,30),
                                                                  (883,177,30),
                                                                  (884,178,22),
                                                                  (885,178,24),
                                                                  (886,179,22),
                                                                  (887,179,24),
                                                                  (888,180,22);
INSERT INTO public.exercise_muscle (id,exercise_id,muscle_id) VALUES
                                                                  (889,180,23),
                                                                  (890,180,24),
                                                                  (926,181,18),
                                                                  (927,181,19),
                                                                  (928,182,20),
                                                                  (929,182,21),
                                                                  (930,183,18),
                                                                  (931,183,20),
                                                                  (932,184,18),
                                                                  (933,184,19);
INSERT INTO public.exercise_muscle (id,exercise_id,muscle_id) VALUES
                                                                  (934,184,21),
                                                                  (935,185,18),
                                                                  (936,185,19),
                                                                  (937,185,21),
                                                                  (938,186,1),
                                                                  (939,187,18),
                                                                  (940,188,18),
                                                                  (941,188,19),
                                                                  (942,188,20),
                                                                  (943,188,21);
INSERT INTO public.exercise_muscle (id,exercise_id,muscle_id) VALUES
                                                                  (944,189,18),
                                                                  (945,189,20),
                                                                  (946,190,18),
                                                                  (947,190,19),
                                                                  (948,190,20),
                                                                  (949,190,21),
                                                                  (950,191,18),
                                                                  (951,191,19),
                                                                  (952,191,20),
                                                                  (953,191,21);
INSERT INTO public.exercise_muscle (id,exercise_id,muscle_id) VALUES
                                                                  (954,192,18),
                                                                  (955,192,19),
                                                                  (956,192,21),
                                                                  (957,193,18),
                                                                  (958,193,19),
                                                                  (959,193,20),
                                                                  (960,193,21),
                                                                  (961,194,18),
                                                                  (962,194,19),
                                                                  (963,194,21);
INSERT INTO public.exercise_muscle (id,exercise_id,muscle_id) VALUES
                                                                  (964,195,18),
                                                                  (965,195,19),
                                                                  (966,195,21),
                                                                  (967,196,18),
                                                                  (968,196,19),
                                                                  (969,196,21),
                                                                  (970,197,18),
                                                                  (971,197,19),
                                                                  (972,197,21),
                                                                  (973,198,20);
INSERT INTO public.exercise_muscle (id,exercise_id,muscle_id) VALUES
                                                                  (974,198,23),
                                                                  (975,198,24);


SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('exercise_muscle_id_seq', (SELECT MAX(id) FROM exercise_muscle));
SELECT setval('history_id_seq', (SELECT MAX(id) FROM history));
SELECT setval('user_exercise_id_seq', (SELECT MAX(id) FROM user_exercise));
SELECT setval('workout_id_seq', (SELECT MAX(id) FROM workout));
SELECT setval('exercises_id_seq', (SELECT MAX(id) FROM exercises));
