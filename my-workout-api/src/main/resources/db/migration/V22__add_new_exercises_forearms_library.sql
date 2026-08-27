INSERT INTO public.exercises
(id, "name", description, difficulty, mechanic)
VALUES (176, 'Rouleau de poignets',
        '1. Tenez le rouleau de poignets à deux mains, les bras tendus devant vous à hauteur des épaules.

2. Enroulez la corde autour de l''axe du rouleau en faisant tourner alternativement les poignets afin de faire monter la charge.

3. Gardez les bras immobiles et concentrez le mouvement sur les poignets et les avant-bras.

4. Une fois la charge arrivée en haut, déroulez lentement la corde en effectuant le mouvement inverse et en contrôlant la descente.',
        'BEGINNER',
        'ISOLATION');

INSERT INTO public.exercise_muscle
(exercise_id, muscle_id)
VALUES
    (176, 30);


INSERT INTO public.exercises
(id, "name", description, difficulty, mechanic)
VALUES (177, 'Flexion inversée des poignets à la barre',
        '1. Asseyez-vous et posez vos avant-bras sur vos cuisses ou sur un banc, les mains dépassant légèrement des genoux, avec la barre en prise pronation.

2. Gardez les avant-bras immobiles et laissez les poignets descendre lentement vers le sol afin d''étirer les muscles de l''avant-bras.

3. Relevez les mains en effectuant une extension des poignets, sans décoller les avant-bras de leur support.

4. Redescendez lentement la charge en contrôlant le mouvement, puis répétez.',
        'BEGINNER',
        'ISOLATION');

INSERT INTO public.exercise_muscle
(exercise_id, muscle_id)
VALUES
    (177, 30);


UPDATE public.exercises
SET "name"='Flexion des poignets à la poulie'
WHERE id=81;



SELECT setval('exercises_id_seq', (SELECT MAX(id) FROM exercises));
