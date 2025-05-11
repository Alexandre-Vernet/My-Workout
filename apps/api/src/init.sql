-- public.exercises definition

-- Drop table

-- DROP TABLE public.exercises;

CREATE TABLE public.exercises
(
    id               serial4            NOT NULL,
    "name"           varchar(50)        NOT NULL,
    description      text NULL,
    is_smart_workout bool DEFAULT false NOT NULL,
    CONSTRAINT exercises_name_key UNIQUE (name),
    CONSTRAINT exercises_pkey PRIMARY KEY (id)
);


-- public.muscle_group definition

-- Drop table

-- DROP TABLE public.muscle_group;

CREATE TABLE public.muscle_group
(
    id     serial4     NOT NULL,
    "name" varchar(20) NOT NULL,
    CONSTRAINT muscle_group_name_key UNIQUE (name),
    CONSTRAINT muscle_group_pkey PRIMARY KEY (id)
);


-- public.users definition

-- Drop table

-- DROP TABLE public.users;

CREATE TABLE public.users
(
    id         serial4 NOT NULL,
    email      varchar(50) NULL,
    "password" varchar(200) NULL,
    created_at timestamp DEFAULT now() NULL,
    updated_at timestamp DEFAULT now() NULL,
    CONSTRAINT users_email_key UNIQUE (email),
    CONSTRAINT users_pkey PRIMARY KEY (id)
);


-- public.history definition

-- Drop table

-- DROP TABLE public.history;

CREATE TABLE public.history
(
    id          serial4                 NOT NULL,
    user_id     int4 NULL,
    exercise_id int4 NULL,
    weight      numeric NULL,
    created_at  timestamp DEFAULT now() NOT NULL,
    CONSTRAINT history_pkey PRIMARY KEY (id),
    CONSTRAINT history_exercise_id_fkey FOREIGN KEY (exercise_id) REFERENCES public.exercises (id) ON DELETE CASCADE,
    CONSTRAINT history_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users (id) ON DELETE CASCADE
);


-- public.muscles definition

-- Drop table

-- DROP TABLE public.muscles;

CREATE TABLE public.muscles
(
    id              serial4     NOT NULL,
    muscle_group_id int4 NULL,
    "name"          varchar(30) NOT NULL,
    CONSTRAINT muscles_name_key UNIQUE (name),
    CONSTRAINT muscles_pkey PRIMARY KEY (id),
    CONSTRAINT muscles_muscle_group_id_fkey FOREIGN KEY (muscle_group_id) REFERENCES public.muscle_group (id) ON DELETE CASCADE
);


-- public.user_exercise definition

-- Drop table

-- DROP TABLE public.user_exercise;

CREATE TABLE public.user_exercise
(
    id          int4 DEFAULT nextval('workout_id_seq'::regclass) NOT NULL,
    user_id     int4 NULL,
    exercise_id int4 NULL,
    CONSTRAINT workout_pkey PRIMARY KEY (id),
    CONSTRAINT workout_exercise_id_fkey FOREIGN KEY (exercise_id) REFERENCES public.exercises (id) ON DELETE CASCADE,
    CONSTRAINT workout_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users (id) ON DELETE CASCADE
);


-- public.exercise_muscle definition

-- Drop table

-- DROP TABLE public.exercise_muscle;

CREATE TABLE public.exercise_muscle
(
    id          serial4 NOT NULL,
    exercise_id int4 NULL,
    muscle_id   int4 NULL,
    CONSTRAINT exercise_muscle_pkey PRIMARY KEY (id),
    CONSTRAINT exercise_muscle_exercise_id_fkey FOREIGN KEY (exercise_id) REFERENCES public.exercises (id) ON DELETE CASCADE,
    CONSTRAINT exercise_muscle_muscle_id_fkey FOREIGN KEY (muscle_id) REFERENCES public.muscles (id) ON DELETE CASCADE
);


CREATE TABLE public.workout
(
    id              serial4 NOT null primary KEY,
    user_id         int4    NOT NULL,
    muscle_group_id int4    NOT NULL,
    date            DATE    NOT NULL,
    FOREIGN KEY (user_id) REFERENCES public.users (id) ON DELETE CASCADE,
    FOREIGN KEY (muscle_group_id) REFERENCES public.muscle_group (id) ON DELETE CASCADE
);


INSERT INTO public.exercise_muscle (exercise_id,muscle_id) VALUES
                                                               (1,1),
                                                               (2,1),
                                                               (3,1),
                                                               (4,1),
                                                               (5,2),
                                                               (6,2),
                                                               (7,2),
                                                               (8,2),
                                                               (9,3),
                                                               (9,4);
INSERT INTO public.exercise_muscle (exercise_id,muscle_id) VALUES
                                                               (9,5),
                                                               (10,4),
                                                               (12,6),
                                                               (13,8),
                                                               (14,7),
                                                               (15,9),
                                                               (16,11),
                                                               (16,10),
                                                               (17,11),
                                                               (17,10);
INSERT INTO public.exercise_muscle (exercise_id,muscle_id) VALUES
                                                               (18,11),
                                                               (18,12),
                                                               (19,15),
                                                               (20,15),
                                                               (21,15),
                                                               (22,15),
                                                               (23,18),
                                                               (24,19),
                                                               (25,18),
                                                               (26,21);
INSERT INTO public.exercise_muscle (exercise_id,muscle_id) VALUES
                                                               (27,21),
                                                               (28,22);







INSERT INTO public.exercises (name,description,is_smart_workout) VALUES
                                                                     ('Course à pied',NULL,false),
                                                                     ('Pompes diamant','En position de planche, les mains placées sous la poitrine, les pouces et les index formant un losange (diamant) en se rejoignant. Les coudes sont proches du corps et les poignets sont alignés avec les épaules. Les pieds sont légèrement écartés, les jambes tendues et le corps formant une ligne droite de la tête aux talons.
Le mouvement commence par une flexion des coudes, en amenant la poitrine vers le sol, en gardant les coudes bien collés au corps et les poignets solides. La descente doit être contrôlée, sans précipitation.
Lorsque la poitrine touche ou frôle le sol, les bras sont tendus pour repousser le corps vers le haut jusqu’à revenir à la position de départ, en gardant les coudes légèrement fléchis à la fin du mouvement. Le tronc reste gainé tout au long de l''exercice, sans laisser les hanches descendre ou monter de manière excessive.',false),
                                                                     ('Écartés poulie haute','Debout au centre d''une station à poulies, un pied légèrement en avant pour la stabilité, le buste droit et légèrement incliné vers l’avant. Les poignées sont saisies en pronation ou en prise neutre, bras tendus ou légèrement fléchis, tirés vers l’extérieur à hauteur des épaules.
Le mouvement débute avec les bras ouverts en croix. En gardant une légère flexion des coudes constante, les bras sont ramenés l’un vers l’autre en arc de cercle devant soi, jusqu’à ce que les poignées se rejoignent à hauteur de la poitrine ou légèrement en dessous.
Le retour se fait lentement et contrôlé, en ouvrant les bras jusqu’à ressentir un étirement confortable des pectoraux. Le tronc reste gainé, sans mouvement du dos ou des épaules, et les bras restent dans un plan horizontal tout au long de l’exécution.',true),
                                                                     ('Écartés unilatéral','Debout à côté d’une poulie placée en position haute, le pied opposé légèrement en avant, le buste droit ou très légèrement penché vers l’avant. Le bras du côté actif est tendu ou légèrement fléchi, tiré vers l’extérieur à hauteur de l’épaule.
En gardant une légère flexion constante au coude, le bras effectue un arc de cercle en direction du centre du corps, jusqu’à amener la main devant la ligne médiane, au niveau de la poitrine ou légèrement en dessous. Le mouvement reste fluide et contrôlé, sans à-coups.
Le retour se fait lentement, en laissant le bras s’ouvrir latéralement jusqu’à ressentir un étirement dans le pectoral. Le bassin et le buste restent fixes, sans rotation ni mouvement parasite. L’autre bras peut tenir la machine pour plus de stabilité.',true),
                                                                     ('Extension verticale','En position assise ou debout, le dos droit et gainé, les bras sont tendus au-dessus de la tête, tenant un haltère à deux mains par l’extrémité (prise en coupe) ou une corde si réalisé à la poulie.
Le mouvement commence avec les coudes proches de la tête, pointés vers le plafond, sans les écarter. L’haltère est descendu lentement derrière la tête en fléchissant les coudes, jusqu’à un étirement confortable des triceps.
Une fois en bas, les bras sont tendus à nouveau en poussant vers le haut jusqu’à l’extension complète, sans verrouiller brutalement les coudes. Le tronc reste droit et stable tout au long du mouvement, sans cambrer excessivement le bas du dos.',false),
                                                                     ('Tirage poulie haute','Debout face à une poulie haute, les pieds écartés à la largeur des hanches, les genoux légèrement fléchis et le tronc droit. La prise est effectuée en pronation, les bras tendus vers le haut pour saisir la barre ou les poignées.
Le mouvement commence par un tirage contrôlé vers le bas, en ramenant la barre ou les poignées vers le bas du thorax, tout en maintenant les coudes proches du corps et en gardant une légère ouverture des épaules. Les omoplates sont resserrées à mesure que le tirage progresse.
Une fois la barre ou les poignées près du haut du torse, la barre est ramenée lentement et de manière contrôlée à la position de départ, avec les bras tendus. Le tronc reste stable et gainé, sans mouvement du bassin ou du bas du dos, et le mouvement reste fluide tout au long de l''exécution.',true),
                                                                     ('Développé couché haltères','Allongé sur un banc plat, les pieds bien ancrés au sol, les omoplates sont resserrées et collées contre le banc pour stabiliser le haut du dos. Une légère cambrure naturelle du bas du dos est conservée. Les haltères sont tenus en pronation, bras tendus au-dessus de la poitrine.
En gardant les poignets solides et les coudes légèrement fléchis, les haltères sont descendus de manière contrôlée jusqu’à ce que les bras soient parallèles au sol ou légèrement en dessous. Les coudes s’écartent à environ 45° par rapport au buste, en restant alignés sous les poignets.
Une fois en bas, les haltères sont poussés vers le haut en suivant une trajectoire légèrement convergente jusqu’à revenir à la position initiale. Le tronc reste gainé, sans mouvement du bassin ni rebond au niveau des épaules.',false),
                                                                     ('Développé incliné haltères','Assis sur un banc incliné à environ 30°, les pieds fermement posés au sol et les omoplates resserrées contre le dossier pour stabiliser le haut du dos. Une légère cambrure naturelle est maintenue au niveau des lombaires. Les haltères sont tenus en pronation, bras tendus au-dessus des clavicules, coudes légèrement fléchis.
Les haltères sont descendus de façon contrôlée jusqu’à ce que les bras forment un angle proche de l’horizontale. Les coudes s’ouvrent à environ 45° par rapport au buste, en gardant les poignets bien au-dessus des coudes.
Une fois en bas, les haltères sont poussés vers le haut en suivant une trajectoire légèrement convergente, jusqu’à revenir bras tendus sans verrouiller les coudes. Le buste reste fixe et gainé tout au long du mouvement, sans à-coups.',false),
                                                                     ('Tirage poulie basse','Debout face à une poulie basse, les pieds écartés à la largeur des hanches, légèrement fléchis, et le tronc droit. La prise est en pronation, les bras tendus devant soi pour saisir la barre ou les poignées, à hauteur du bassin.
Le mouvement commence par un tirage contrôlé, en fléchissant les coudes pour ramener la barre ou les poignées derrière la tête, tout en maintenant les coudes près du crâne. Une fois la barre ou les poignées derrière la tête, les bras sont ensuite tendus complètement vers le haut, en contrôlant le mouvement pour éviter toute tension excessive sur les épaules.
Le retour se fait lentement, ramenant la barre ou les poignées à la position de départ, avec les bras tendus devant soi. Le tronc reste fixe et stable, sans balancer ni cambrer le bas du dos pendant toute l''exécution.',true),
                                                                     ('Squats','Debout, les pieds écartés à la largeur des épaules, les orteils légèrement tournés vers l’extérieur. Le buste droit, la tête dans l’alignement de la colonne, les bras peuvent être tendus devant soi ou placés sur les hanches selon la variation de l’exercice.
Le mouvement commence par une flexion des hanches et des genoux, en envoyant les fesses vers l’arrière comme pour s’asseoir sur une chaise imaginaire. Les genoux suivent la direction des pieds, sans les laisser dépasser des orteils, et les cuisses sont descendues parallèles au sol ou légèrement plus bas si la mobilité le permet.
Une fois en bas, les talons restent bien ancrés au sol, et le corps est poussé vers le haut en poussant à travers les talons, en redressant les jambes et en revenant à la position de départ, tout en maintenant le tronc gainé et le dos droit.',false);
INSERT INTO public.exercises (name,description,is_smart_workout) VALUES
                                                                     ('Extension mollets','Debout, les pieds positionnés sur un step ou une plateforme, avec les talons suspendus dans le vide et la barre de squat placée sur les épaules comme pour un squat classique. Les genoux sont légèrement fléchis pour maintenir l’équilibre, et le buste est droit, les mains tenant la barre de manière stable.
Le mouvement commence par une poussée des orteils pour élever les talons aussi haut que possible, en contractant les mollets au sommet du mouvement. Les jambes restent stables et seules les chevilles bougent.
La descente se fait lentement et de manière contrôlée, jusqu’à ce que les talons soient bien en dessous du niveau du step, en ressentant un étirement des mollets. Ensuite, on refait la montée en poussant les orteils vers le haut et en contractant les mollets.',false),
                                                                     ('Élévation latérales','Debout, les pieds écartés à la largeur des hanches, les genoux légèrement fléchis, et le tronc droit. Les bras sont tendus sur les côtés, tenant un haltère dans chaque main avec une prise neutre (paumes face à soi).
Le mouvement commence par une élévation des bras sur les côtés, en gardant les coudes légèrement fléchis et en contrôlant le mouvement pour éviter les à-coups. Les bras montent jusqu’à la hauteur des épaules, sans les dépasser.
À l’apogée du mouvement, les omoplates sont légèrement resserrées, et les coudes ne doivent pas être plus hauts que les mains. La descente doit être lente et contrôlée, en revenant à la position de départ sans laisser les bras tomber rapidement. Le tronc reste stable tout au long de l''exercice, sans balancement du corps.',false),
                                                                     ('Développé militaire (45°)','Assis sur un banc incliné à 45°, les pieds bien ancrés au sol et le dos soutenu par le banc. Les mains tiennent les haltères à hauteur des épaules, les coudes légèrement en avant et dirigés vers le bas. Les paumes des mains sont tournées vers l’avant.
Le mouvement commence par une poussée des haltères vers le haut, en tendant les bras sans verrouiller les coudes. Les omoplates sont resserrées et le buste reste stable pendant toute l’extension. Les poignets restent droits et les bras doivent monter de manière fluide et contrôlée.
Une fois les bras presque tendus, la descente s’effectue lentement, en ramenant les haltères à la hauteur des épaules tout en contrôlant la trajectoire. Le tronc doit rester gainé pour maintenir la stabilité du mouvement.',false),
                                                                     ('Tractions prise large','Suspendu à une barre de traction, les mains placées plus larges que la largeur des épaules avec une prise pronation (paumes vers l''avant). Les bras sont tendus et le corps est suspendu sans mouvement initial.
Le mouvement commence par un tirage des coudes vers le bas et l''arrière, en essayant de ramener le buste vers la barre tout en maintenant les jambes tendues ou légèrement fléchies. Les omoplates doivent se resserrer pendant le tirage, et les coudes restent légèrement écartés du tronc.
Une fois que le menton atteint ou dépasse la barre, on redescend lentement et de manière contrôlée en étendant les bras, jusqu’à revenir à la position de départ, en évitant de se laisser tomber ou de balancer le corps. Le tronc reste gainé et stable pendant toute l''exécution.',false),
                                                                     ('Tractions prise neutre','Suspendu à une barre de traction ou des poignées suspendues, les mains placées en prise neutre (paumes face à face, prise en supination). Les bras sont tendus et le corps est suspendu, les jambes légèrement fléchies ou tendues, selon le confort.
Le mouvement commence par un tirage des coudes vers le bas et l''arrière, en amenant le buste vers la barre. Les omoplates se resserrent à chaque tirage, et les coudes suivent une trajectoire naturelle, restant proches du corps.
Lorsque le menton atteint la barre, on redescend lentement et de manière contrôlée, en ramenant les bras tendus à la position de départ, en maintenant le tronc stable et sans balancer le corps. L''accent est mis sur la contraction des muscles du dos et des bras tout au long du mouvement.',false),
                                                                     ('Tractions prise serrée','Suspendu à une barre de traction avec les mains placées rapprochées, à peu près à la largeur des épaules, en prise pronation (paumes vers l’avant). Le corps est suspendu, les bras tendus et les jambes peuvent être légèrement fléchies ou tendues.
Le mouvement commence par un tirage des coudes vers le bas et l’arrière, en cherchant à amener la poitrine vers la barre. Les coudes restent près du tronc tout au long du mouvement, et les omoplates se resserrent à chaque tirage.
Une fois le menton passé au-dessus de la barre, le mouvement inverse commence en redescendant lentement et de manière contrôlée, jusqu’à ce que les bras soient tendus et le corps revenu à la position de départ. Le tronc reste stable et bien gainé pendant toute l''exécution, en évitant tout balancement du corps.',false),
                                                                     ('Rameur surchargé','Assis sur le siège du rameur, les pieds bien calés dans les repose-pieds et les jambes légèrement fléchies. La barre du rameur est équipée d''une poulie reliée à un point fixe qui permet d''ajouter de la charge. Les mains saisissent la barre avec une prise pronation, les bras tendus devant soi.
Le mouvement commence par une extension des bras et une ouverture du torse, en tirant la barre vers le bas et en ramenant les coudes vers l’arrière, tout en maintenant une trajectoire parallèle au corps. Les omoplates se resserrent au fur et à mesure du tirage, et les coudes passent près du tronc.
Une fois la barre tirée au niveau du bas du thorax ou du ventre, la barre est ensuite ramenée lentement et de manière contrôlée à la position de départ, en tendant les bras. Le tronc reste stable et gainé, sans balancer le corps, pour maximiser l’effort des muscles du dos.',true),
                                                                     ('Curl barre','Debout, les pieds écartés à la largeur des hanches et le tronc bien droit. Les bras sont tendus devant soi, tenant une barre avec une prise en supination (paumes vers le haut), les mains écartées à la largeur des épaules. Les coudes sont légèrement fléchis et fixés contre les côtés du tronc.
Le mouvement commence par une flexion des coudes, en tirant la barre vers le haut, tout en gardant les coudes immobiles. La barre doit suivre une trajectoire verticale, et les avant-bras montent jusqu''à ce que les biceps soient pleinement contractés.
Une fois le mouvement au sommet, la barre est lentement descendue à la position de départ, en contrôlant la descente pour maintenir une tension constante sur les biceps. Le tronc reste stable et ne doit pas se pencher en arrière pour aider à lever la barre.',false),
                                                                     ('Traction supination','Suspendu à une barre de traction avec les mains placées à la largeur des épaules, en prise supination (paumes vers soi). Le corps est suspendu, les bras tendus et les jambes peuvent être légèrement fléchies ou tendues.
Le mouvement commence par un tirage des coudes vers le bas et l’arrière, en amenant le buste vers la barre. Les omoplates se resserrent à chaque tirage, et les coudes restent proches du tronc. L’accent est mis sur les biceps et le dos lors du tirage.
Lorsque le menton dépasse la barre, on redescend lentement et de manière contrôlée en ramenant les bras tendus à la position de départ. Le tronc reste gainé et stable tout au long du mouvement, sans balancer le corps.',false),
                                                                     ('Curl marteau haltères','Debout, les pieds écartés à la largeur des hanches, les genoux légèrement fléchis et le tronc droit. Les bras sont tendus le long du corps, tenant un haltère dans chaque main avec les paumes tournées l’une vers l’autre (prise neutre).
Le mouvement commence par une flexion des coudes, en levant les haltères vers les épaules tout en maintenant les paumes face à face. Les coudes doivent rester près du tronc pendant toute l''exécution du mouvement.
Une fois que les haltères arrivent au niveau des épaules, on marque une courte pause pour contracter les biceps. Ensuite, les haltères sont redescendus lentement et de manière contrôlée à la position de départ, en maintenant une tension constante sur les biceps et les avant-bras.',false);
INSERT INTO public.exercises (name,description,is_smart_workout) VALUES
                                                                     ('Curl inversé barre','Debout, les pieds écartés à la largeur des hanches, les genoux légèrement fléchis, le tronc droit. Les bras sont tendus devant soi, tenant une barre avec une prise pronation (paumes vers le bas), les mains écartées à la largeur des épaules.
Le mouvement commence par une flexion des coudes, en tirant la barre vers le haut tout en maintenant les coudes immobiles. La barre doit suivre une trajectoire verticale, et les avant-bras montent jusqu''à ce que les biceps soient pleinement contractés.
Une fois le mouvement au sommet, la barre est lentement redescendue à la position de départ, en contrôlant la descente pour garder la tension sur les biceps et les avant-bras. Le tronc reste stable, et il ne doit pas y avoir de balancement du corps pour aider au mouvement.',false),
                                                                     ('Crunch à la poulie haute','En position debout, face à une poulie haute, les pieds écartés à la largeur des hanches. Saisissez la corde ou la barre attachée à la poulie avec une prise neutre (paumes vers l’intérieur). Reculez légèrement pour créer une tension sur la poulie et commencez l’exercice avec les bras tendus au-dessus de la tête.
Le mouvement commence par une flexion du tronc, en tirant la corde ou la barre vers le bas et en ramenant les coudes vers les genoux. Pendant la descente, contractez les abdominaux pour faire rouler la colonne vertébrale vers l’avant, en veillant à ne pas utiliser les bras pour tirer.
Une fois que le tronc est bien fléchi, avec les coudes proches des genoux, le mouvement est inversé en remontant lentement à la position de départ, tout en gardant la tension dans les abdos. Les hanches et les jambes restent stables tout au long de l’exercice.',false),
                                                                     ('Relevé de jambes à la barre de traction','Suspendu à une barre de traction, les mains placées à la largeur des épaules avec une prise pronation (paumes vers l’avant) ou neutre (paumes face à face), les bras tendus et le corps suspendu. Les jambes sont tendues ou légèrement fléchies, en fonction du niveau de confort.
Le mouvement commence par une contraction des abdominaux pour relever les jambes, en les amenant vers le haut devant soi. L’accent est mis sur l’activation des abdominaux inférieurs, et les jambes doivent être contrôlées tout au long du mouvement.
Les jambes sont élevées jusqu''à ce qu''elles soient parallèles au sol ou plus haut si possible, puis redescendues lentement à la position de départ, en évitant tout balancement du corps. Il est essentiel de maintenir le tronc stable et les bras tendus pendant toute l''exécution.',false),
                                                                     ('Crunch','Allongé sur le dos, les genoux fléchis à environ 90° et les pieds posés à plat sur le sol. Les mains peuvent être placées derrière la tête, croisées sur la poitrine, ou tendues vers l''avant pour un meilleur contrôle. Le tronc reste bien ancré au sol pendant la phase initiale.
Le mouvement commence par une contraction des abdominaux pour soulever la tête, les épaules et le haut du dos du sol, en direction des genoux. Les coudes restent écartés sur les côtés et les mains ne doivent pas tirer sur la tête.
Le mouvement doit être effectué de manière contrôlée, en évitant de forcer sur la nuque. Une fois la flexion maximale atteinte (généralement lorsque le haut du dos est décollé du sol), redescendez lentement et de manière contrôlée à la position de départ, tout en maintenant la contraction des abdominaux.',false),
                                                                     ('Gainage sur 2 mains','Positionné face au sol, les bras tendus et les mains posées à la largeur des épaules. Les pieds sont écartés à la largeur des hanches, avec les orteils en contact avec le sol pour maintenir la stabilité. Le corps forme une ligne droite de la tête aux pieds, sans que les hanches ne soient trop hautes ni trop basses.
Le mouvement commence par une contraction des abdominaux, des fessiers et des cuisses pour maintenir cette position sans laisser les hanches s''affaisser ou se soulever. Il est important de garder le tronc bien gainé, sans creuser le bas du dos ni relever les fesses.
Maintenez cette position aussi longtemps que possible en respirant de manière contrôlée. Le regard peut être dirigé vers le sol ou légèrement devant pour garder une bonne position de la tête.',false),
                                                                     ('Gainage sur le côté','Allongé sur le côté, en appui sur un bras tendu, avec les jambes tendues et empilées l''une sur l''autre. Le corps forme une ligne droite de la tête aux pieds. L’autre main peut être posée sur la hanche ou tendue vers le plafond pour plus de stabilité.
Le mouvement commence en activant les abdominaux et les fessiers pour soulever le bassin du sol, de manière à créer une ligne droite avec le corps. L’objectif est de maintenir cette position sans laisser le bassin s''affaisser.
Le tronc doit rester bien gainé, et il ne faut pas permettre au bas du dos de se creuser ou aux hanches de se baisser. Respirez profondément tout en maintenant la position, et essayez de tenir aussi longtemps que possible, en veillant à maintenir une bonne posture.',false),
                                                                     ('Leg curl','Allongé sur le ventre, les jambes tendues et les chevilles attachées à la barre de la poulie, les hanches bien placées sur le banc pour éviter toute pression indésirable. Les bras sont posés à plat sur le banc pour plus de stabilité.
Le mouvement commence par une flexion des genoux, en tirant la barre de la poulie vers les fesses. Les jambes sont fléchies de manière contrôlée, en gardant les cuisses à plat sur le banc et sans lever les hanches. L’accent est mis sur la contraction des ischio-jambiers à chaque flexion.
Une fois la barre proche des fesses, la barre est lentement ramenée à la position de départ, en contrôlant bien la descente pour maintenir une tension constante sur les muscles. Les hanches restent fixes et il ne doit pas y avoir de mouvement du bassin pendant l''exécution.',true);









INSERT INTO public.muscle_group (name) VALUES
                                           ('Pectoraux'),
                                           ('Triceps'),
                                           ('Jambes'),
                                           ('Épaules'),
                                           ('Dos'),
                                           ('Biceps'),
                                           ('Abdominaux'),
                                           ('Cardio');










INSERT INTO public.muscles (muscle_group_id,name) VALUES
                                                      (1,'Pectoraux'),
                                                      (2,'Triceps'),
                                                      (3,'Quadriceps'),
                                                      (3,'Ischio-jambiers'),
                                                      (3,'Fessier'),
                                                      (3,'Mollets'),
                                                      (4,'Deltoïdes antérieurs'),
                                                      (4,'Deltoïdes moyens'),
                                                      (4,'Deltoïdes postérieurs'),
                                                      (5,'Trapèzes');
INSERT INTO public.muscles (muscle_group_id,name) VALUES
                                                      (5,'Grand dorsal'),
                                                      (5,'Grand rond'),
                                                      (5,'Petit rond'),
                                                      (5,'Lombaires'),
                                                      (6,'Biceps'),
                                                      (6,'Biceps courts'),
                                                      (6,'Biceps longs'),
                                                      (7,'Grand droit - Haut'),
                                                      (7,'Grand droit - Bas'),
                                                      (7,'Obliques');
INSERT INTO public.muscles (muscle_group_id,name) VALUES
                                                      (7,'Transverse'),
                                                      (8,'Cardio');









INSERT INTO public.user_exercise (user_id,exercise_id) VALUES
                                                           (7,17),
                                                           (7,19),
                                                           (7,6),
                                                           (7,23),
                                                           (7,3),
                                                           (7,13);
