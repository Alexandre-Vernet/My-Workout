TRUNCATE TABLE exercise_muscle, history, workout, user_exercise, muscles, exercises, muscle_group, users RESTART IDENTITY CASCADE;

INSERT INTO public.muscle_group
    ("name")
VALUES ('PECTORAUX'),
       ('TRICEPS'),
       ('JAMBES'),
       ('EPAULES'),
       ('DOS'),
       ('BICEPS'),
       ('ABDOMINAUX'),
       ('CARDIO');


INSERT INTO public.users
    (email, "password", created_at, updated_at, is_admin)
VALUES ('test@gmail.com', 'test',
        '2025-04-14 00:00:00.000', '2025-04-14 00:00:00.000', false),
       ('test2@gmail.com', 'test2',
        '2025-04-14 00:00:00.000', '2025-04-14 00:00:00.000', false);


INSERT INTO public.muscles (muscle_group_id, "name")
VALUES (3, 'Quadriceps'),
       (4, 'Deltoïdes antérieurs'),
       (4, 'Deltoïdes moyens'),
       (4, 'Deltoïdes postérieurs'),
       (5, 'Trapèzes'),
       (5, 'Grand dorsal'),
       (5, 'Grand rond'),
       (5, 'Petit rond'),
       (7, 'Grand droit - Haut'),
       (7, 'Grand droit - Bas');
INSERT INTO public.muscles (muscle_group_id, "name")
VALUES (7, 'Transverse'),
       (8, 'Cardio'),
       (8, 'Tronc'),
       (8, 'Full body'),
       (1, 'Milieu des pectoraux'),
       (1, 'Bas des pectoraux'),
       (1, 'Haut des pectoraux'),
       (2, 'Chef latéral'),
       (2, 'Chef médial'),
       (2, 'Chef long');
INSERT INTO public.muscles (muscle_group_id, "name")
VALUES (6, 'Bracho-radial'),
       (6, 'Brachial'),
       (6, 'Biceps court'),
       (6, 'Biceps long'),
       (3, 'Soléaire'),
       (3, 'Ischio-jambier'),
       (3, 'Jumeau'),
       (3, 'Fessier'),
       (5, 'Lombaire'),
       (7, 'Oblique');
INSERT INTO public.muscles (muscle_group_id, "name")
VALUES (3, 'Adducteurs'),
       (3, 'Abducteurs');


INSERT INTO public.exercises ("name", description, is_smart_workout)
VALUES ('Développé couché haltères', 'Allongé sur un banc plat, les pieds bien ancrés au sol, les omoplates sont resserrées et collées contre le banc pour stabiliser le haut du dos. Une légère cambrure naturelle du bas du dos est conservée. Les haltères sont tenus en pronation, bras tendus au-dessus de la poitrine.
En gardant les poignets solides et les coudes légèrement fléchis, les haltères sont descendus de manière contrôlée jusqu’à ce que les bras soient parallèles au sol ou légèrement en dessous. Les coudes s’écartent à environ 45° par rapport au buste, en restant alignés sous les poignets.
Une fois en bas, les haltères sont poussés vers le haut en suivant une trajectoire légèrement convergente jusqu’à revenir à la position initiale. Le tronc reste gainé, sans mouvement du bassin ni rebond au niveau des épaules.',
        false),
       ('Développé incliné haltères', 'Assis sur un banc incliné à environ 30°, les pieds fermement posés au sol et les omoplates resserrées contre le dossier pour stabiliser le haut du dos. Une légère cambrure naturelle est maintenue au niveau des lombaires. Les haltères sont tenus en pronation, bras tendus au-dessus des clavicules, coudes légèrement fléchis.
Les haltères sont descendus de façon contrôlée jusqu’à ce que les bras forment un angle proche de l’horizontale. Les coudes s’ouvrent à environ 45° par rapport au buste, en gardant les poignets bien au-dessus des coudes.
Une fois en bas, les haltères sont poussés vers le haut en suivant une trajectoire légèrement convergente, jusqu’à revenir bras tendus sans verrouiller les coudes. Le buste reste fixe et gainé tout au long du mouvement, sans à-coups.',
        false),
       ('Roulette abdominaux',
        'À genoux, tenant une roulette (ou un rouleau abdominal) devant toi. En gardant le dos droit et les abdominaux bien contractés, fais rouler la roulette vers l’avant en étendant les bras, jusqu’à sentir un étirement dans les abdominaux. Puis, ramène lentement la roulette vers toi en contractant les abdominaux. Le mouvement fait travailler tout le grand droit, les obliques et le transverse.',
        false),
       ('Mountain climber',
        'En position de planche haute, mains au sol sous les épaules, jambes tendues. Amène alternativement les genoux vers la poitrine de façon dynamique, en gardant le tronc gainé. Cet exercice sollicite surtout le bas du grand droit, le transverse et un peu les obliques, tout en faisant travailler le cardio.',
        false),
       ('Crunch à la machine',
        'Assis sur une machine à crunch, les pieds calés, les mains tenant les poignées ou placées sur la tête selon la machine. En contractant les abdominaux, fléchis le tronc en rapprochant les épaules vers les cuisses, en ciblant le haut du grand droit. Le retour à la position initiale doit être contrôlé.',
        false),
       ('Rotations russes',
        'Assis au sol, genoux fléchis et légèrement surélevés, pieds éventuellement décollés du sol. Le buste est légèrement incliné en arrière. Tiens un poids ou simplement les mains jointes. Effectue une rotation du buste de gauche à droite en contractant les obliques, tout en gardant le transverse engagé pour stabiliser le tronc.',
        false),
       ('Écartés poulie haute', 'Debout au centre d''une station à poulies, un pied légèrement en avant pour la stabilité, le buste droit et légèrement incliné vers l’avant. Les poignées sont saisies en pronation ou en prise neutre, bras tendus ou légèrement fléchis, tirés vers l’extérieur à hauteur des épaules.
Le mouvement débute avec les bras ouverts en croix. En gardant une légère flexion des coudes constante, les bras sont ramenés l’un vers l’autre en arc de cercle devant soi, jusqu’à ce que les poignées se rejoignent à hauteur de la poitrine ou légèrement en dessous.
Le retour se fait lentement et contrôlé, en ouvrant les bras jusqu’à ressentir un étirement confortable des pectoraux. Le tronc reste gainé, sans mouvement du dos ou des épaules, et les bras restent dans un plan horizontal tout au long de l’exécution.',
        true),
       ('Écartés unilatéral', 'Debout à côté d’une poulie placée en position haute, le pied opposé légèrement en avant, le buste droit ou très légèrement penché vers l’avant. Le bras du côté actif est tendu ou légèrement fléchi, tiré vers l’extérieur à hauteur de l’épaule.
En gardant une légère flexion constante au coude, le bras effectue un arc de cercle en direction du centre du corps, jusqu’à amener la main devant la ligne médiane, au niveau de la poitrine ou légèrement en dessous. Le mouvement reste fluide et contrôlé, sans à-coups.
Le retour se fait lentement, en laissant le bras s’ouvrir latéralement jusqu’à ressentir un étirement dans le pectoral. Le bassin et le buste restent fixes, sans rotation ni mouvement parasite. L’autre bras peut tenir la machine pour plus de stabilité.',
        true),
       ('Planche', 'Allongé sur le côté, en appui sur un bras tendu, avec les jambes tendues et empilées l''une sur l''autre. Le corps forme une ligne droite de la tête aux pieds. L’autre main peut être posée sur la hanche ou tendue vers le plafond pour plus de stabilité.
Le mouvement commence en activant les abdominaux et les fessiers pour soulever le bassin du sol, de manière à créer une ligne droite avec le corps. L’objectif est de maintenir cette position sans laisser le bassin s''affaisser.
Le tronc doit rester bien gainé, et il ne faut pas permettre au bas du dos de se creuser ou aux hanches de se baisser. Respirez profondément tout en maintenant la position, et essayez de tenir aussi longtemps que possible, en veillant à maintenir une bonne posture.',
        false),
       ('Planche latérale', 'Positionné face au sol, les bras tendus et les mains posées à la largeur des épaules. Les pieds sont écartés à la largeur des hanches, avec les orteils en contact avec le sol pour maintenir la stabilité. Le corps forme une ligne droite de la tête aux pieds, sans que les hanches ne soient trop hautes ni trop basses.
Le mouvement commence par une contraction des abdominaux, des fessiers et des cuisses pour maintenir cette position sans laisser les hanches s''affaisser ou se soulever. Il est important de garder le tronc bien gainé, sans creuser le bas du dos ni relever les fesses.
Maintenez cette position aussi longtemps que possible en respirant de manière contrôlée. Le regard peut être dirigé vers le sol ou légèrement devant pour garder une bonne position de la tête.',
        false);
INSERT INTO public.exercises ("name", description, is_smart_workout)
VALUES ('Crunch bicyclette',
        'Allongé sur le dos, les mains légèrement derrière la tête (sans tirer sur la nuque), les jambes décollées du sol avec les genoux fléchis à 90°. En gardant les abdominaux contractés, effectue un mouvement croisé en rapprochant alternativement le coude droit du genou gauche, puis le coude gauche du genou droit, comme si tu pédalais en l’air. Le haut du dos reste décollé du sol durant toute la durée de l’exercice. Le mouvement doit rester lent et contrôlé pour bien cibler les abdominaux, sans tirer avec les bras.',
        false),
       ('Toe Touch', 'Allongé sur le dos, les jambes tendues vers le plafond à la verticale, perpendiculaires au sol. Les bras sont également tendus vers le haut.
Le mouvement consiste à décoller les épaules du sol en contractant les abdominaux pour aller toucher les pointes de pieds avec les mains. Le bas du dos reste en contact avec le sol, le regard est vers les pieds, et le mouvement est fluide et contrôlé, sans balancer les bras.',
        false),
       ('Pompes diamant', 'En position de planche, les mains placées sous la poitrine, les pouces et les index formant un losange (diamant) en se rejoignant. Les coudes sont proches du corps et les poignets sont alignés avec les épaules. Les pieds sont légèrement écartés, les jambes tendues et le corps formant une ligne droite de la tête aux talons.
Le mouvement commence par une flexion des coudes, en amenant la poitrine vers le sol, en gardant les coudes bien collés au corps et les poignets solides. La descente doit être contrôlée, sans précipitation.
Lorsque la poitrine touche ou frôle le sol, les bras sont tendus pour repousser le corps vers le haut jusqu’à revenir à la position de départ, en gardant les coudes légèrement fléchis à la fin du mouvement. Le tronc reste gainé tout au long de l''exercice, sans laisser les hanches descendre ou monter de manière excessive.',
        false),
       ('Squats', 'Debout, les pieds écartés à la largeur des épaules, les orteils légèrement tournés vers l’extérieur. Le buste droit, la tête dans l’alignement de la colonne, les bras peuvent être tendus devant soi ou placés sur les hanches selon la variation de l’exercice.
Le mouvement commence par une flexion des hanches et des genoux, en envoyant les fesses vers l’arrière comme pour s’asseoir sur une chaise imaginaire. Les genoux suivent la direction des pieds, sans les laisser dépasser des orteils, et les cuisses sont descendues parallèles au sol ou légèrement plus bas si la mobilité le permet.
Une fois en bas, les talons restent bien ancrés au sol, et le corps est poussé vers le haut en poussant à travers les talons, en redressant les jambes et en revenant à la position de départ, tout en maintenant le tronc gainé et le dos droit.',
        false),
       ('Élévation latérales', 'Debout, les pieds écartés à la largeur des hanches, les genoux légèrement fléchis, et le tronc droit. Les bras sont tendus sur les côtés, tenant un haltère dans chaque main avec une prise neutre (paumes face à soi).
Le mouvement commence par une élévation des bras sur les côtés, en gardant les coudes légèrement fléchis et en contrôlant le mouvement pour éviter les à-coups. Les bras montent jusqu’à la hauteur des épaules, sans les dépasser.
À l’apogée du mouvement, les omoplates sont légèrement resserrées, et les coudes ne doivent pas être plus hauts que les mains. La descente doit être lente et contrôlée, en revenant à la position de départ sans laisser les bras tomber rapidement. Le tronc reste stable tout au long de l''exercice, sans balancement du corps.',
        false),
       ('Tractions prise large', 'Suspendu à une barre de traction, les mains placées plus larges que la largeur des épaules avec une prise pronation (paumes vers l''avant). Les bras sont tendus et le corps est suspendu sans mouvement initial.
Le mouvement commence par un tirage des coudes vers le bas et l''arrière, en essayant de ramener le buste vers la barre tout en maintenant les jambes tendues ou légèrement fléchies. Les omoplates doivent se resserrer pendant le tirage, et les coudes restent légèrement écartés du tronc.
Une fois que le menton atteint ou dépasse la barre, on redescend lentement et de manière contrôlée en étendant les bras, jusqu’à revenir à la position de départ, en évitant de se laisser tomber ou de balancer le corps. Le tronc reste gainé et stable pendant toute l''exécution.',
        false),
       ('Tractions prise neutre', 'Suspendu à une barre de traction ou des poignées suspendues, les mains placées en prise neutre (paumes face à face, prise en supination). Les bras sont tendus et le corps est suspendu, les jambes légèrement fléchies ou tendues, selon le confort.
Le mouvement commence par un tirage des coudes vers le bas et l''arrière, en amenant le buste vers la barre. Les omoplates se resserrent à chaque tirage, et les coudes suivent une trajectoire naturelle, restant proches du corps.
Lorsque le menton atteint la barre, on redescend lentement et de manière contrôlée, en ramenant les bras tendus à la position de départ, en maintenant le tronc stable et sans balancer le corps. L''accent est mis sur la contraction des muscles du dos et des bras tout au long du mouvement.',
        false),
       ('Extension mollets debout', 'Debout, les pieds positionnés sur un step ou une plateforme, avec les talons suspendus dans le vide et la barre de squat placée sur les épaules comme pour un squat classique. Les genoux sont légèrement fléchis pour maintenir l’équilibre, et le buste est droit, les mains tenant la barre de manière stable.
Le mouvement commence par une poussée des orteils pour élever les talons aussi haut que possible, en contractant les mollets au sommet du mouvement. Les jambes restent stables et seules les chevilles bougent.
La descente se fait lentement et de manière contrôlée, jusqu’à ce que les talons soient bien en dessous du niveau du step, en ressentant un étirement des mollets. Ensuite, on refait la montée en poussant les orteils vers le haut et en contractant les mollets.',
        false),
       ('Développé militaire', 'Assis sur un banc incliné à 45°, les pieds bien ancrés au sol et le dos soutenu par le banc. Les mains tiennent les haltères à hauteur des épaules, les coudes légèrement en avant et dirigés vers le bas. Les paumes des mains sont tournées vers l’avant.
Le mouvement commence par une poussée des haltères vers le haut, en tendant les bras sans verrouiller les coudes. Les omoplates sont resserrées et le buste reste stable pendant toute l’extension. Les poignets restent droits et les bras doivent monter de manière fluide et contrôlée.
Une fois les bras presque tendus, la descente s’effectue lentement, en ramenant les haltères à la hauteur des épaules tout en contrôlant la trajectoire. Le tronc doit rester gainé pour maintenir la stabilité du mouvement.',
        false),
       ('Curl barre', 'Debout, les pieds écartés à la largeur des hanches et le tronc bien droit. Les bras sont tendus devant soi, tenant une barre avec une prise en supination (paumes vers le haut), les mains écartées à la largeur des épaules. Les coudes sont légèrement fléchis et fixés contre les côtés du tronc.
Le mouvement commence par une flexion des coudes, en tirant la barre vers le haut, tout en gardant les coudes immobiles. La barre doit suivre une trajectoire verticale, et les avant-bras montent jusqu''à ce que les biceps soient pleinement contractés.
Une fois le mouvement au sommet, la barre est lentement descendue à la position de départ, en contrôlant la descente pour maintenir une tension constante sur les biceps. Le tronc reste stable et ne doit pas se pencher en arrière pour aider à lever la barre.',
        false);
INSERT INTO public.exercises ("name", description, is_smart_workout)
VALUES ('Traction supination', 'Suspendu à une barre de traction avec les mains placées à la largeur des épaules, en prise supination (paumes vers soi). Le corps est suspendu, les bras tendus et les jambes peuvent être légèrement fléchies ou tendues.
Le mouvement commence par un tirage des coudes vers le bas et l’arrière, en amenant le buste vers la barre. Les omoplates se resserrent à chaque tirage, et les coudes restent proches du tronc. L’accent est mis sur les biceps et le dos lors du tirage.
Lorsque le menton dépasse la barre, on redescend lentement et de manière contrôlée en ramenant les bras tendus à la position de départ. Le tronc reste gainé et stable tout au long du mouvement, sans balancer le corps.',
        false),
       ('Curl marteau haltères', 'Debout, les pieds écartés à la largeur des hanches, les genoux légèrement fléchis et le tronc droit. Les bras sont tendus le long du corps, tenant un haltère dans chaque main avec les paumes tournées l’une vers l’autre (prise neutre).
Le mouvement commence par une flexion des coudes, en levant les haltères vers les épaules tout en maintenant les paumes face à face. Les coudes doivent rester près du tronc pendant toute l''exécution du mouvement.
Une fois que les haltères arrivent au niveau des épaules, on marque une courte pause pour contracter les biceps. Ensuite, les haltères sont redescendus lentement et de manière contrôlée à la position de départ, en maintenant une tension constante sur les biceps et les avant-bras.',
        false),
       ('Curl inversé barre', 'Debout, les pieds écartés à la largeur des hanches, les genoux légèrement fléchis, le tronc droit. Les bras sont tendus devant soi, tenant une barre avec une prise pronation (paumes vers le bas), les mains écartées à la largeur des épaules.
Le mouvement commence par une flexion des coudes, en tirant la barre vers le haut tout en maintenant les coudes immobiles. La barre doit suivre une trajectoire verticale, et les avant-bras montent jusqu''à ce que les biceps soient pleinement contractés.
Une fois le mouvement au sommet, la barre est lentement redescendue à la position de départ, en contrôlant la descente pour garder la tension sur les biceps et les avant-bras. Le tronc reste stable, et il ne doit pas y avoir de balancement du corps pour aider au mouvement.',
        false),
       ('Crunch', 'Allongé sur le dos, les genoux fléchis à environ 90° et les pieds posés à plat sur le sol. Les mains peuvent être placées derrière la tête, croisées sur la poitrine, ou tendues vers l''avant pour un meilleur contrôle. Le tronc reste bien ancré au sol pendant la phase initiale.
Le mouvement commence par une contraction des abdominaux pour soulever la tête, les épaules et le haut du dos du sol, en direction des genoux. Les coudes restent écartés sur les côtés et les mains ne doivent pas tirer sur la tête.
Le mouvement doit être effectué de manière contrôlée, en évitant de forcer sur la nuque. Une fois la flexion maximale atteinte (généralement lorsque le haut du dos est décollé du sol), redescendez lentement et de manière contrôlée à la position de départ, tout en maintenant la contraction des abdominaux.',
        false),
       ('Crunch à la poulie haute', 'En position debout, face à une poulie haute, les pieds écartés à la largeur des hanches. Saisissez la corde ou la barre attachée à la poulie avec une prise neutre (paumes vers l’intérieur). Reculez légèrement pour créer une tension sur la poulie et commencez l’exercice avec les bras tendus au-dessus de la tête.
Le mouvement commence par une flexion du tronc, en tirant la corde ou la barre vers le bas et en ramenant les coudes vers les genoux. Pendant la descente, contractez les abdominaux pour faire rouler la colonne vertébrale vers l’avant, en veillant à ne pas utiliser les bras pour tirer.
Une fois que le tronc est bien fléchi, avec les coudes proches des genoux, le mouvement est inversé en remontant lentement à la position de départ, tout en gardant la tension dans les abdos. Les hanches et les jambes restent stables tout au long de l’exercice.',
        true),
       ('Relevé de jambes suspendu', 'Suspendu à une barre de traction, les mains placées à la largeur des épaules avec une prise pronation (paumes vers l’avant) ou neutre (paumes face à face), les bras tendus et le corps suspendu. Les jambes sont tendues ou légèrement fléchies, en fonction du niveau de confort.
Le mouvement commence par une contraction des abdominaux pour relever les jambes, en les amenant vers le haut devant soi. L’accent est mis sur l’activation des abdominaux inférieurs, et les jambes doivent être contrôlées tout au long du mouvement.
Les jambes sont élevées jusqu''à ce qu''elles soient parallèles au sol ou plus haut si possible, puis redescendues lentement à la position de départ, en évitant tout balancement du corps. Il est essentiel de maintenir le tronc stable et les bras tendus pendant toute l''exécution.',
        false),
       ('Tractions prise serrée', 'Suspendu à une barre de traction avec les mains placées rapprochées, en prise pronation (paumes vers l’avant). Le corps est suspendu, les bras tendus et les jambes peuvent être légèrement fléchies ou tendues.
Le mouvement commence par un tirage des coudes vers le bas et l’arrière, en cherchant à amener la poitrine vers la barre. Les coudes restent près du tronc tout au long du mouvement, et les omoplates se resserrent à chaque tirage.
Une fois le menton passé au-dessus de la barre, le mouvement inverse commence en redescendant lentement et de manière contrôlée, jusqu’à ce que les bras soient tendus et le corps revenu à la position de départ. Le tronc reste stable et bien gainé pendant toute l''exécution, en évitant tout balancement du corps.',
        false),
       ('Extension verticale', 'En position assise ou debout, le dos droit et gainé, les bras sont tendus au-dessus de la tête, tenant un haltère à deux mains par l’extrémité (prise en coupe) ou une corde si réalisé à la poulie.
Le mouvement commence avec les coudes proches de la tête, pointés vers le plafond, sans les écarter. L’haltère est descendu lentement derrière la tête en fléchissant les coudes, jusqu’à un étirement confortable des triceps.
Une fois en bas, les bras sont tendus à nouveau en poussant vers le haut jusqu’à l’extension complète, sans verrouiller brutalement les coudes. Le tronc reste droit et stable tout au long du mouvement, sans cambrer excessivement le bas du dos.',
        false),
       ('Tirage poulie haute', 'Debout face à une poulie haute, les pieds écartés à la largeur des hanches, les genoux légèrement fléchis et le tronc droit. La prise est effectuée en pronation, les bras tendus vers le haut pour saisir la barre ou les poignées.
Le mouvement commence par un tirage contrôlé vers le bas, en ramenant la barre ou les poignées vers le bas du thorax, tout en maintenant les coudes proches du corps et en gardant une légère ouverture des épaules. Les omoplates sont resserrées à mesure que le tirage progresse.
Une fois la barre ou les poignées près du haut du torse, la barre est ramenée lentement et de manière contrôlée à la position de départ, avec les bras tendus. Le tronc reste stable et gainé, sans mouvement du bassin ou du bas du dos, et le mouvement reste fluide tout au long de l''exécution.',
        true),
       ('Rameur surchargé', 'Assis sur le siège du rameur, les pieds bien calés dans les repose-pieds et les jambes légèrement fléchies. La barre du rameur est équipée d''une poulie reliée à un point fixe qui permet d''ajouter de la charge. Les mains saisissent la barre avec une prise pronation, les bras tendus devant soi.
Le mouvement commence par une extension des bras et une ouverture du torse, en tirant la barre vers le bas et en ramenant les coudes vers l’arrière, tout en maintenant une trajectoire parallèle au corps. Les omoplates se resserrent au fur et à mesure du tirage, et les coudes passent près du tronc.
Une fois la barre tirée au niveau du bas du thorax ou du ventre, la barre est ensuite ramenée lentement et de manière contrôlée à la position de départ, en tendant les bras. Le tronc reste stable et gainé, sans balancer le corps, pour maximiser l’effort des muscles du dos.',
        true);
INSERT INTO public.exercises ("name", description, is_smart_workout)
VALUES ('Rameur', 'Assis sur la machine, les pieds bien fixés sur les repose-pieds, genoux légèrement fléchis, les mains tenant la poignée avec une prise ferme. Le dos est droit, légèrement incliné vers l’avant au départ.
Le mouvement débute par une poussée des jambes, les bras tendus, en gardant le dos droit. Une fois les jambes presque tendues, le tronc s’incline légèrement vers l’arrière, et les bras tirent la poignée vers le bas du sternum. L’ordre est : jambes → tronc → bras.
Pour revenir à la position de départ, les bras se tendent en premier, puis le tronc revient vers l’avant, et enfin les jambes se replient. Ce retour se fait de manière fluide et contrôlée. Le mouvement complet doit être rythmé, puissant à la poussée et relâché au retour, pour un travail cardio efficace et continu.',
        false),
       ('Vélo', 'Assis sur la selle, les mains posées sur le guidon et les pieds bien calés sur les pédales. Le dos reste droit ou légèrement incliné vers l’avant selon le type de vélo utilisé.
Le pédalage se fait de manière fluide, avec un mouvement circulaire régulier, sans à-coups. L’effort peut être ajusté en fonction de la résistance ou de la vitesse, pour travailler l’endurance, le souffle ou faire du fractionné.
L’objectif est de maintenir un rythme constant, en respirant régulièrement et en gardant une posture confortable tout au long de la séance.',
        false),
       ('Curl incliné', 'Allongé sur un banc incliné (45 à 60°), un haltère dans chaque main, les bras pendent verticalement vers le sol, en arrière du buste. Les paumes sont tournées vers l’avant dès le départ.
Le mouvement commence par une flexion des coudes, en maintenant les bras fixes et en remontant les haltères vers les épaules.
L’amplitude est maximale grâce à l’extension des bras vers l’arrière en début de mouvement, ce qui étire fortement le biceps.
La descente est lente, avec un bon contrôle de la charge.', false),
       ('Tirage poulie basse', 'Debout, dos à la poulie basse, les pieds écartés à largeur des hanches pour une bonne stabilité. Le corps est légèrement incliné vers l’avant, les abdominaux contractés, et les fessiers engagés pour stabiliser le bassin. La corde est tenue à deux mains, les bras fléchis, coudes pointés vers le haut et légèrement vers l’avant, les mains derrière la tête.

Les coudes sont proches des oreilles, les omoplates fixées en position neutre. Une légère cambrure naturelle du bas du dos est conservée sans exagération.

En gardant les coudes fixes et serrés, les avant-bras sont tendus vers le haut pour étendre complètement les bras, en contractant les triceps en haut du mouvement. Le geste est fluide, sans à-coup, et les poignets restent alignés avec les avant-bras.

Une fois l’extension complète atteinte (sans verrouiller les coudes), le mouvement est inversé de manière contrôlée pour revenir à la position de départ, en maintenant la tension musculaire tout au long du trajet.

Le tronc reste gainé, sans mouvement parasite du dos ou du bassin, et l’équilibre est assuré par l’engagement des jambes et du centre du corps.',
        true),
       ('Leg curl (Smart-Workout)', 'Allongé sur le ventre, les jambes tendues et les chevilles attachées à la barre de la poulie, les hanches bien placées sur le banc pour éviter toute pression indésirable. Les bras sont posés à plat sur le banc pour plus de stabilité.
Le mouvement commence par une flexion des genoux, en tirant la barre de la poulie vers les fesses. Les jambes sont fléchies de manière contrôlée, en gardant les cuisses à plat sur le banc et sans lever les hanches. L’accent est mis sur la contraction des ischio-jambiers à chaque flexion.
Une fois la barre proche des fesses, la barre est lentement ramenée à la position de départ, en contrôlant bien la descente pour maintenir une tension constante sur les muscles. Les hanches restent fixes et il ne doit pas y avoir de mouvement du bassin pendant l''exécution.',
        true),
       ('Pilates', 'Pratiqué au sol sur un tapis, le Pilates combine des mouvements lents, contrôlés et centrés sur la respiration. Chaque exercice vise à renforcer les muscles profonds, améliorer la posture, la souplesse et l’équilibre.
La séance se concentre sur le contrôle du mouvement, l’alignement du corps et la coordination entre la respiration et l’exécution. Le tronc (ceinture abdominale, lombaires, hanches) reste engagé en permanence.
Les transitions sont fluides et sans à-coups, avec une attention portée à la qualité plutôt qu’à l’intensité. C’est une méthode douce mais efficace pour renforcer, mobiliser et détendre le corps.',
        false),
       ('Ring Fit', 'Activité interactive combinant des exercices physiques et un jeu vidéo. À l’aide d’un accessoire en forme d’anneau (le Ring-Con) et d’un capteur de mouvement fixé à la jambe, l’utilisateur effectue des mouvements variés : squats, courses sur place, pressions sur l’anneau, rotations du tronc, etc.
Les exercices sont intégrés dans un univers ludique, où chaque mouvement permet de progresser dans le jeu (attaques, déplacements, défis).
C’est une manière motivante de travailler à la fois le cardio, la mobilité, le gainage et le renforcement musculaire, tout en s’amusant. L’intensité peut varier selon les niveaux et les objectifs.',
        false),
       ('Développé couché barre', 'Allongé sur un banc horizontal, les pieds à plat au sol. La barre est tenue à largeur des épaules ou un peu plus large, au-dessus de la poitrine.
Le mouvement commence avec la barre descendue en contrôlant jusqu’au bas des pectoraux, coudes fléchis à environ 90°. Ensuite, on pousse la barre vers le haut en tendant les bras, sans verrouiller complètement les coudes. Le dos reste légèrement cambré, les omoplates resserrées pour garder les épaules stables.',
        false),
       ('Pec Deck', 'Assis sur la machine, dos bien calé contre le dossier, avant-bras posés contre les bras de la machine ou poignées en main selon le modèle.
Le mouvement consiste à ramener les bras l’un vers l’autre en arc de cercle devant soi, bras légèrement fléchis. On contrôle ensuite le retour en gardant la même courbure. L’exercice isole très bien les pectoraux, surtout la partie interne, sans trop engager les triceps.',
        false),
       ('Écartés couché haltères', 'Allongé sur un banc plat, un haltère dans chaque main, bras tendus au-dessus de la poitrine, coudes légèrement fléchis.
On ouvre les bras en contrôlant le mouvement pour descendre les haltères de chaque côté, jusqu’à ce que les bras soient parallèles au sol. Puis on ramène les bras en arc de cercle pour revenir à la position de départ, en gardant la même flexion de coudes. L’accent est mis sur l’étirement et la contraction des pectoraux, en minimisant l’intervention des triceps.

', false);
INSERT INTO public.exercises ("name", description, is_smart_workout)
VALUES ('Développé incliné machine convergente', 'Assis sur une machine inclinée (environ 30°), les poignées sont saisies à hauteur des épaules.
Le mouvement consiste à pousser les poignées vers l’avant et légèrement vers l’intérieur, suivant une trajectoire en arc de cercle. On contrôle le retour en gardant les omoplates serrées contre le dossier. L’angle d’inclinaison permet de cibler le haut des pectoraux, tout en bénéficiant de la stabilité et de la trajectoire guidée de la machine.',
        false),
       ('Leg extension',
        'Assis sur la machine, les jambes sous les coussins, les pieds en appui. Le mouvement démarre par une extension des jambes en contractant le quadriceps, les genoux se tendent sans verrouillage complet. La descente se fait lentement en contrôlant la trajectoire pour revenir à la position initiale. Le dos reste droit pendant l''exercice.',
        false),
       ('Soulevé de terre',
        'Debout, une barre tenue devant soi, les jambes presque droites avec un léger fléchissement aux genoux. Le buste se penche vers l’avant en gardant le dos droit, la barre descend le long des jambes jusqu’à un étirement ressenti à l’arrière des cuisses. La remontée s’effectue en poussant sur les hanches tout en contractant les muscles postérieurs.',
        false),
       ('Hip thrust', 'Allongé avec le haut du dos appuyé sur un banc, la barre posée sur les hanches. Les pieds sont à plat au sol, jambes fléchies. Le mouvement débute par une poussée des talons pour relever le bassin aussi haut que possible en contractant les muscles fessiers. La descente se fait lentement sans reposer complètement le bassin au sol.

', false),
       ('Hack squat',
        'Positionné dans la machine, dos appuyé contre le dossier, pieds posés sur la plateforme à largeur des épaules. Le mouvement commence par une flexion des jambes en gardant le dos plaqué, puis une extension pour revenir à la position de départ sans verrouiller les genoux. Le mouvement est fluide et contrôlé.',
        false),
       ('Pistol squat',
        'En appui sur une jambe, l’autre jambe tendue devant soi, le corps reste droit. Le mouvement consiste à fléchir la jambe d’appui en descendant lentement et en contrôlant l’équilibre, puis à remonter en poussant avec cette jambe. Le tronc reste gainé durant toute l’exécution.',
        false),
       ('Fentes haltères',
        'Debout, un haltère dans chaque main, les bras le long du corps. Un grand pas est effectué vers l’avant, suivi d’une flexion des deux genoux jusqu’à ce que le genou arrière soit proche du sol. Le retour à la position initiale se fait en poussant sur la jambe avant.',
        false),
       ('Squat bulgare',
        'Une jambe est placée en arrière sur un banc, l’autre jambe au sol devant soi. Le mouvement débute par une flexion lente de la jambe avant, la jambe arrière descendant vers le sol sans le toucher complètement. La remontée s’effectue en poussant sur la jambe avant, le buste restant droit et stable.',
        false),
       ('Relevé de jambes',
        'Installé sur la chaise romaine (peu aussi se faire au sol sur le dos) lever lentement les jambes vers le haut, en contractant surtout le bas du grand droit. Descendre les jambes lentement sans cambrer le bas du dos, en contrôlant le mouvement.',
        false),
       ('Écartés poulie vis-à-vis',
        'Debout au centre de la station vis-à-vis, un pied peut être placé légèrement en avant pour stabiliser la posture. Le buste est droit, légèrement incliné vers l’avant selon les préférences, avec les genoux très légèrement fléchis. Le tronc est gainé, les omoplates sont resserrées sans tension excessive, et les épaules sont abaissées.',
        false);
INSERT INTO public.exercises ("name", description, is_smart_workout)
VALUES ('Presse à cuisses inclinée',
        'Assis sur la machine, les pieds placés à plat sur la plateforme, à largeur des épaules. Le dos est bien calé contre le dossier. Le mouvement commence par une flexion des jambes pour ramener la plateforme vers soi, puis une extension progressive en poussant avec les pieds sans verrouiller complètement les genoux. Le mouvement est contrôlé à la montée comme à la descente.',
        false),
       ('Barre au front',
        'Allongé sur un banc plat, la barre tenue en pronation, les mains espacées à largeur d’épaules. Les bras sont tendus au-dessus de la poitrine, les coudes pointés vers le plafond. Le mouvement commence par une flexion lente des coudes, en abaissant la barre vers le front sans mouvement brusque, jusqu’à ressentir un étirement contrôlé des triceps. La remontée se fait en poussant la barre vers le haut jusqu’à l’extension complète des bras, sans verrouiller les coudes. Le dos reste plaqué au banc et le tronc gainé tout au long du mouvement.',
        false),
       ('Dips (triceps)',
        'Suspendu à des barres parallèles, les bras tendus, les épaules légèrement basses. Le corps est maintenu droit, sans pencher en avant, afin de maximiser la sollicitation des triceps. Le mouvement commence par une flexion lente des coudes, en descendant le corps vers le bas jusqu’à ce que les coudes forment un angle d’environ 90°, en ressentant une tension contrôlée dans les triceps. La remontée s’effectue en poussant sur les bras, en tendant les coudes sans verrouillage brutal. Le tronc reste gainé et stable, sans balancement, tout au long de l’exercice.',
        false),
       ('Dips (Pectoraux)', 'En appui sur les barres parallèles, bras tendus, buste légèrement penché en avant et jambes croisées derrière.
On descend en fléchissant les coudes jusqu’à sentir l’étirement dans les pectoraux, puis on pousse pour revenir à la position haute. Plus le buste est incliné vers l’avant, plus l’exercice cible les pectoraux (et moins les triceps). L’amplitude doit rester contrôlée pour éviter les tensions excessives aux épaules.',
        false),
       ('Élévation latérale machine', 'Assis(e) sur la machine, le dos bien calé contre le dossier, les pieds à plat au sol. Les bras sont placés contre les coussinets latéraux, coudes légèrement fléchis, les mains tenant les poignées (si disponibles).
Le mouvement débute par une élévation des bras sur les côtés, en contractant les épaules pour faire monter les coussinets jusqu’à la hauteur des épaules. Les coudes restent légèrement fléchis et ne doivent pas dépasser la hauteur des mains.
Une fois en haut, on marque un bref temps de contraction, puis on redescend lentement à la position initiale, en gardant le contrôle. Le tronc reste bien droit et immobile tout au long de l''exercice.',
        false),
       ('Élévations latérales à la poulie', 'Debout à côté d''une poulie basse, la poignée tenue avec une prise neutre (paume face au corps), le bras légèrement fléchi. L''autre main peut tenir la machine pour la stabilité.
Le mouvement commence par une élévation latérale du bras, en gardant une trajectoire semi-circulaire jusqu’à atteindre la hauteur de l’épaule. Le coude reste sous la main, légèrement fléchi.
Une fois en haut, une légère pause est marquée, puis le bras redescend lentement sous contrôle. L''exercice peut être réalisé unilatéralement pour mieux isoler chaque épaule.',
        false),
       ('Élévations frontales', 'Debout, les pieds écartés à la largeur des épaules, genoux légèrement fléchis et le tronc gainé. Un haltère dans chaque main (ou une barre), les bras tendus devant les cuisses, paumes tournées vers les cuisses (prise neutre) ou vers le bas (pronation).
Le mouvement consiste à lever les bras tendus ou légèrement fléchis devant soi jusqu’à la hauteur des épaules. Les poignets restent dans l’axe de l’avant-bras, sans basculer.
Une fois en haut, les bras redescendent lentement à la position de départ, toujours sous contrôle. Il est important d’éviter les à-coups ou le balancement du buste.',
        false),
       ('Oiseau (élévations latérales buste penché)', 'Debout, genoux fléchis, le buste penché vers l’avant à environ 45° ou parallèle au sol, en gardant le dos droit. Un haltère dans chaque main, les bras tendus vers le bas, paumes tournées l''une vers l''autre.
Le mouvement commence par une élévation des bras sur les côtés, en gardant les coudes légèrement fléchis et en contractant les muscles postérieurs des épaules. Les bras montent jusqu’à être à l’horizontale, dans l’alignement des épaules.
Une fois en haut, une brève pause est marquée, puis les bras redescendent lentement. Le tronc reste fixe, sans mouvement de balancier, pour cibler précisément l’arrière des épaules.',
        false),
       ('Tirage horizontal poulie', 'Assis face à la poulie basse, pieds calés, dos droit. Saisir la barre avec une prise neutre ou pronation, bras tendus.
Tirer la barre vers l''abdomen en ramenant les coudes en arrière et en resserrant les omoplates. Contrôle du mouvement à la descente. Le buste reste stable sans s’incliner.',
        false),
       ('Tirage vertical', 'Assis face à la poulie haute, les cuisses bloquées. Saisir la barre avec une prise large en pronation.
Tirer la barre jusqu’au haut du torse en gardant les coudes tirés vers le bas et légèrement vers l’arrière. Contrôle en remontant. Le buste reste droit ou légèrement penché en arrière.',
        false);
INSERT INTO public.exercises ("name", description, is_smart_workout)
VALUES ('Rowing haltères',
        'un genou et une main posés sur un banc, le dos bien droit, l’autre main tient l’haltère bras tendu vers le sol. Ramener l’haltère vers la hanche en gardant le coude près du corps, puis redescendre lentement. Contraction des omoplates en haut du mouvement.',
        false),
       ('Shrug',
        'Debout, barre ou haltères tenue en pronation à hauteur des cuisses. Hausser les épaules verticalement vers les oreilles en gardant les bras tendus. Pause en haut, puis redescente contrôlée. Le mouvement est uniquement vertical, sans rotation ou roulement des épaules.',
        false),
       ('Curl concentré', 'Assis sur un banc, les jambes écartées, un haltère est tenu dans une main, le bras reposant contre l’intérieur de la cuisse du même côté. Le buste est légèrement penché en avant et le bras est entièrement étendu vers le bas.
Le mouvement consiste à fléchir le coude pour remonter l’haltère vers l’épaule, sans bouger le haut du bras, en contractant volontairement le biceps. Le poignet reste fixe et dans l’axe de l’avant-bras.
Une fois en haut, une courte contraction peut être marquée, puis l’haltère est redescendu lentement et de manière contrôlée. Le bras ne doit pas se balancer, et le tronc reste stable.',
        false),
       ('Curl haltères', 'Debout, les pieds à la largeur des hanches, un haltère dans chaque main en prise neutre au départ (paumes face au corps), les bras le long du corps.
Le mouvement commence par une flexion des coudes, en faisant pivoter les poignets (supination) pour que les paumes soient tournées vers le haut pendant la montée.
Les coudes restent proches du buste, sans les faire avancer. Une fois les haltères arrivés au niveau des épaules, la descente s’effectue lentement pour contrôler la charge.
Le tronc est gainé tout au long du mouvement, sans balancement du dos.', false),
       ('Curl pupitre', 'Installé sur un pupitre incliné, le bras repose entièrement sur le support, un haltère ou une barre est tenu avec la paume vers le haut. L’épaule est verrouillée, ce qui empêche tout mouvement parasite.
Le mouvement consiste à fléchir le coude pour amener la charge vers l’épaule, en gardant le contact entre le bras et le pupitre.
Le retour à la position initiale est lent et contrôlé, sans laisser tomber la charge. L''épaule reste fixe tout au long du mouvement.',
        false),
       ('Course à pied', 'La course à pied est un exercice cardiovasculaire naturel qui consiste à enchaîner des foulées rapides en propulsion, en alternant les appuis au sol entre les pieds. Le tronc reste droit, le regard porté vers l’avant, les bras fléchis à 90° effectuent un balancier coordonné avec les jambes, et la foulée est rythmée et fluide. On veille à poser d’abord l’avant ou le milieu du pied pour amortir l’impact, puis à dérouler jusqu’au talon.

Elle sollicite principalement les jambes (quadriceps, ischio-jambiers, mollets), les fessiers et les abdominaux (transverse en particulier) pour la stabilité, tout en améliorant l’endurance cardiovasculaire et la coordination.',
        false),
       ('Fentes barre', 'Les fentes à la barre consistent à poser une barre sur les trapèzes, comme pour un squat, puis à effectuer un grand pas vers l’avant avec une jambe. Le mouvement se poursuit en fléchissant les deux genoux jusqu’à ce que le genou arrière descende près du sol, tandis que la jambe avant reste perpendiculaire, genou au-dessus du pied. Le dos reste bien droit, le regard vers l’avant, et le buste gainé pour maintenir l’équilibre. On pousse ensuite sur le talon de la jambe avant pour revenir à la position initiale. L’exercice est ensuite répété avec l’autre jambe.

C’est un excellent mouvement pour renforcer les quadriceps, les ischio-jambiers et les fessiers, tout en sollicitant aussi le transverse pour la stabilité et l''équilibre.',
        false),
       ('Extension mollets assis',
        'Assis sur un banc, les genoux fléchis à 90°, les pieds posés à plat sur une cale ou un step afin de permettre une amplitude complète du mouvement (talons plus bas que les orteils). Une barre est placée sur les cuisses, juste au-dessus des genoux.',
        false),
       ('Tirage dos à la poulie haute', 'Debout, dos à la poulie haute, les pieds en position décalée pour assurer l’équilibre, le buste est incliné vers l’avant à environ 30 à 45°, tout en gardant le dos droit et le tronc bien gainé. La corde est tenue à deux mains, derrière la tête, les coudes fléchis et proches des tempes, orientés vers l’avant.

Le regard reste neutre, légèrement orienté vers le sol pour conserver un bon alignement cervical. Les poignets restent dans l’axe, sans cassure.

En gardant les coudes fixes et serrés, les avant-bras s’étendent vers l’avant dans un mouvement fluide et contrôlé, jusqu’à ce que les bras soient presque tendus. Le mouvement suit la ligne du buste sans élan, ni verrouillage complet des coudes.

Lors du retour à la position de départ, la charge est contrôlée, sans perte de tension musculaire. Le gainage reste actif, le bassin stable, sans cambrure excessive du bas du dos.',
        true),
       ('Presse à cuisses horizontale', 'Assis sur la machine, le dos fermement appuyé contre le dossier, les hanches sont bien calées et le bassin reste neutre. Les pieds sont placés à largeur d’épaules sur la plateforme, légèrement ouverts vers l’extérieur, de manière à garder les genoux alignés avec les pointes de pieds. Les poignées latérales sont tenues pour stabiliser le haut du corps sans tirer dessus.

En gardant le dos entièrement plaqué au siège et les abdominaux gainés, la plateforme est poussée en extension contrôlée jusqu’à tendre presque complètement les jambes, sans verrouiller les genoux. Les chevilles, genoux et hanches restent alignés pendant le mouvement.

La descente se fait lentement, en ramenant la plateforme vers la poitrine jusqu’à ce que les genoux atteignent environ 90°, ou un peu plus si la mobilité le permet, tout en veillant à garder les talons en contact constant avec la plateforme et le bassin collé au dossier pour éviter toute bascule du bas du dos.

Une fois la position basse atteinte, la poussée reprend en expirant, en activant surtout les quadriceps et les fessiers, jusqu’à revenir à la position initiale en gardant un mouvement fluide et maîtrisé, sans à-coups ni rebond sur les butées de la machine.',
        false);
INSERT INTO public.exercises ("name", description, is_smart_workout)
VALUES ('Leg curl', 'Allongé sur le ventre, les jambes tendues et les chevilles attachées à la barre de la poulie, les hanches bien placées sur le banc pour éviter toute pression indésirable. Les bras sont posés à plat sur le banc pour plus de stabilité.
Le mouvement commence par une flexion des genoux, en tirant la barre de la poulie vers les fesses. Les jambes sont fléchies de manière contrôlée, en gardant les cuisses à plat sur le banc et sans lever les hanches. L’accent est mis sur la contraction des ischio-jambiers à chaque flexion.
Une fois la barre proche des fesses, la barre est lentement ramenée à la position de départ, en contrôlant bien la descente pour maintenir une tension constante sur les muscles. Les hanches restent fixes et il ne doit pas y avoir de mouvement du bassin pendant l''exécution.',
        false),
       ('Adducteurs assis à la machine', 'Assis sur la machine à adducteurs, le dos bien calé contre le dossier, le bassin est stable et neutre, sans rétroversion ni cambrure excessive. Les jambes sont placées sur les supports prévus, légèrement fléchies, et la largeur de départ est réglée en fonction du confort et de la mobilité de la hanche. Les mains se posent sur les poignées pour stabiliser le tronc sans tirer dessus.

En gardant les abdominaux engagés et le dos immobile, le mouvement commence par un rapprochement contrôlé des jambes. Les cuisses se serrent l’une vers l’autre en contractant principalement les adducteurs, tout en maintenant les genoux alignés avec les pieds et en évitant de faire rouler le bassin vers l’avant.

Une fois la position de contraction maximale atteinte — sans forcer au-delà de la limite de mobilité — les jambes sont réouvertes lentement et de manière contrôlée. L’écartement se fait jusqu’à ressentir une légère tension dans l’intérieur des cuisses, sans basculer ni décoller le bas du dos du dossier.

À chaque répétition, le tronc reste stable, le bassin immobile et la trajectoire des jambes fluide, de façon à solliciter pleinement les adducteurs sans compensation du bas du dos ou des hanches.',
        false),
       ('Abducteurs assis à la machine', 'Assis sur la machine à abducteurs, le dos bien calé contre le dossier, le bassin reste neutre et stable, sans cambrure excessive ni rétroversion du bassin. Les jambes sont placées sur les coussins extérieurs prévus à cet effet, légèrement fléchies, et l’écartement de départ est ajusté en fonction du confort et de la mobilité de la hanche. Les mains se posent sur les poignées pour stabiliser le tronc sans tirer avec les bras.

En maintenant les abdominaux engagés et le dos immobile, le mouvement débute par une ouverture contrôlée des jambes. Les cuisses s’écartent l’une de l’autre grâce à la contraction des muscles abducteurs, tout en gardant les genoux dans l’axe des pieds et en évitant de laisser basculer le bassin d’un côté ou de l’autre.

Une fois l’amplitude maximale confortable atteinte — sans chercher à forcer au-delà de la mobilité de la hanche — les jambes sont ramenées lentement vers la position initiale. Le retour se fait de manière contrôlée, en conservant la tension sur les muscles abducteurs et sans laisser les jambes revenir brutalement vers l’intérieur.

À chaque répétition, le tronc reste stable, le bassin immobile et le mouvement fluide, de façon à solliciter pleinement les abducteurs sans compensation du bas du dos, des hanches ou des quadriceps.',
        false),
       ('Tractions australiennes', 'Installé sous une barre fixe ou une barre guidée placée à hauteur de hanche ou de poitrine, le pratiquant se positionne en suspension avec les talons au sol. Le corps forme une ligne droite, des épaules jusqu’aux chevilles, sans affaissement du bassin ni cambrure excessive. La prise est légèrement plus large que la largeur des épaules, en pronation ou en supination selon la préférence, et les omoplates sont placées en position neutre, sans tension excessive.

Le mouvement commence en engageant les omoplates, qui se resserrent et s’abaissent légèrement pour initier la traction. Le buste se dirige ensuite vers la barre de manière contrôlée, en tirant avec les dorsaux et les bras tout en maintenant les coudes proches du corps, sans les laisser s’écarter. Le tronc reste aligné et gainé tout au long du geste, les hanches ne tombent pas et les talons restent en contact avec le sol pour assurer la stabilité.

Une fois la poitrine proche de la barre — sans aller jusqu’à creuser le bas du dos ou avancer le cou — une courte pause marque la contraction maximale. La redescente se fait lentement, en laissant les bras se tendre complètement tout en gardant les épaules contrôlées et sans "couler" vers le bas. Le corps redescend en bloc, sans casser l’alignement, jusqu''à retrouver la position initiale.

À chaque répétition, la priorité est mise sur la stabilité du tronc, l’ouverture contrôlée de la cage thoracique et la trajectoire fluide du tirage, de manière à solliciter efficacement le dos, les biceps et les muscles stabilisateurs sans compensation du bassin ou des épaules.',
        false),
       ('Extension mollets presse à cuisses', ' Assis sur la machine, le dos fermement appuyé contre le dossier, les hanches sont bien calées et le bassin reste neutre. Les pieds sont placés à largeur d’épaules et en bas de la plateforme. Les genoux alignés avec les pointes de pieds. Les poignées latérales sont tenues pour stabiliser le haut du corps sans tirer dessus.

En gardant le dos entièrement plaqué au siège, la plateforme est poussée en extension contrôlée jusqu’à tendre complètement les mollets.
La descente se fait lentement, en ramenant les talons sous la passerelle, tout en veillant à garder la pointe de pied en contact constant avec la plateforme.
Une fois la position basse atteinte, la poussée reprend en expirant, en activant les mollets, jusqu’à revenir à la position initiale en gardant un mouvement fluide et maîtrisé, sans à-coups ni rebond sur les butées de la machine. ',
        false),
       ('Romanian Deadlift (RDL)',
        'Le romanian deadlift (ou soulevé de terre roumain) est un exercice super intéressant pour les fessiers et les ischio-jambiers.',
        false),
       ('Écartés poulie basse vis-à-vis', 'Aaadkdkdjdjdj', true);


INSERT INTO public.exercise_muscle (exercise_id, muscle_id)
VALUES (2, 1),
       (3, 1),
       (5, 2),
       (7, 2),
       (9, 3),
       (9, 4),
       (9, 5),
       (10, 4),
       (12, 6),
       (13, 8);
INSERT INTO public.exercise_muscle (exercise_id, muscle_id)
VALUES (14, 7),
       (15, 9),
       (16, 11),
       (16, 10),
       (17, 11),
       (17, 10),
       (18, 11),
       (18, 12),
       (21, 15),
       (22, 15);
INSERT INTO public.exercise_muscle (exercise_id, muscle_id)
VALUES (23, 18),
       (24, 19),
       (25, 18),
       (27, 21),
       (28, 22),
       (29, 22),
       (31, 23),
       (32, 24),
       (30, 22),
       (33, 3);
INSERT INTO public.exercise_muscle (exercise_id, muscle_id)
VALUES (33, 4),
       (33, 5),
       (33, 6),
       (34, 19),
       (40, 1),
       (1, 25),
       (4, 25),
       (35, 25),
       (36, 25),
       (37, 25);
INSERT INTO public.exercise_muscle (exercise_id, muscle_id)
VALUES (38, 25),
       (39, 26),
       (41, 3),
       (41, 5),
       (41, 4),
       (42, 3),
       (43, 4),
       (43, 5),
       (44, 5),
       (45, 3);
INSERT INTO public.exercise_muscle (exercise_id, muscle_id)
VALUES (45, 5),
       (45, 4),
       (46, 3),
       (46, 5),
       (47, 3),
       (47, 5),
       (47, 4),
       (48, 3),
       (48, 5),
       (48, 4);
INSERT INTO public.exercise_muscle (exercise_id, muscle_id)
VALUES (6, 28),
       (7, 27),
       (7, 28),
       (49, 27),
       (49, 28),
       (50, 27),
       (8, 27),
       (6, 27),
       (51, 8),
       (52, 8);
INSERT INTO public.exercise_muscle (exercise_id, muscle_id)
VALUES (53, 7),
       (54, 9),
       (16, 12),
       (17, 12),
       (55, 11),
       (55, 10),
       (55, 11),
       (55, 12),
       (56, 11),
       (56, 10);
INSERT INTO public.exercise_muscle (exercise_id, muscle_id)
VALUES (56, 12),
       (57, 11),
       (57, 10),
       (57, 12),
       (57, 13),
       (58, 10),
       (19, 16),
       (20, 16),
       (21, 30),
       (22, 30);
INSERT INTO public.exercise_muscle (exercise_id, muscle_id)
VALUES (59, 16),
       (59, 17),
       (60, 16),
       (60, 17),
       (61, 16),
       (61, 17),
       (62, 16),
       (62, 17),
       (19, 17),
       (20, 17);
INSERT INTO public.exercise_muscle (exercise_id, muscle_id)
VALUES (24, 21),
       (26, 21),
       (63, 18),
       (63, 19),
       (63, 21),
       (64, 19),
       (64, 21),
       (65, 18),
       (66, 20),
       (66, 21);
INSERT INTO public.exercise_muscle (exercise_id, muscle_id)
VALUES (67, 20),
       (67, 18),
       (67, 19),
       (67, 20),
       (68, 18),
       (68, 19),
       (68, 21),
       (27, 20),
       (69, 31),
       (71, 2);
INSERT INTO public.exercise_muscle (exercise_id, muscle_id)
VALUES (43, 14),
       (72, 3),
       (72, 4),
       (72, 5),
       (73, 4),
       (74, 32),
       (74, 5),
--        (75, 33),
       (75, 5),
       (76, 10);
INSERT INTO public.exercise_muscle (exercise_id, muscle_id)
VALUES (76, 9),
       (76, 11),
       (77, 6);
--        (78, 4),
--        (78, 5),
--        (79, 26);
