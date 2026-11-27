package com.avernet.myworkoutapi.config;

import org.flywaydb.core.api.callback.Callback;
import org.flywaydb.core.api.callback.Context;
import org.flywaydb.core.api.callback.Event;
import org.springframework.stereotype.Component;

import java.sql.SQLException;
import java.sql.Statement;

/**
 * muscle_group/muscles sont des tables de référence qu'aucune migration n'a jamais peuplées : leurs lignes ont été
 * ajoutées à la main dans les bases existantes (prod, dev partagée), jamais via une migration Flyway ni l'application
 * (ni MuscleController ni MuscleGroupController n'exposent de création). Sans ce callback, toute base neuve (tests
 * Testcontainers, nouvel environnement) échoue dès V16, qui référence des muscle_id inexistants dans une base vide.
 * Les INSERT sont idempotents (ON CONFLICT DO NOTHING) : no-op sur les bases qui ont déjà ces données.
 */
@Component
public class MuscleReferenceDataFlywayCallback implements Callback {

    private static final String VERSION_REQUIRING_MUSCLE_DATA = "16";

    private static final String SEED_SQL = """
        INSERT INTO public.muscle_group (id, name) VALUES
            (1, 'PECTORAUX'),
            (2, 'TRICEPS'),
            (3, 'JAMBES'),
            (4, 'EPAULES'),
            (5, 'DOS'),
            (6, 'BICEPS'),
            (7, 'ABDOMINAUX'),
            (8, 'CARDIO')
        ON CONFLICT (id) DO NOTHING;

        SELECT setval('muscle_group_id_seq', (SELECT MAX(id) FROM public.muscle_group));

        INSERT INTO public.muscles (id, muscle_group_id, name) VALUES
            (1, 1, 'Haut des pectoraux'),
            (2, 2, 'Chef long'),
            (3, 3, 'Quadriceps'),
            (4, 3, 'Ischio-jambier'),
            (5, 3, 'Fessier'),
            (6, 3, 'Jumeau'),
            (7, 4, 'Deltoïdes antérieurs'),
            (8, 4, 'Deltoïdes moyens'),
            (9, 4, 'Deltoïdes postérieurs'),
            (10, 5, 'Trapèzes'),
            (11, 5, 'Grand dorsal'),
            (12, 5, 'Grand rond'),
            (13, 5, 'Petit rond'),
            (14, 5, 'Lombaire'),
            (15, 6, 'Brachial'),
            (16, 6, 'Biceps court'),
            (17, 6, 'Biceps long'),
            (18, 7, 'Grand droit - Haut'),
            (19, 7, 'Grand droit - Bas'),
            (20, 7, 'Oblique'),
            (21, 7, 'Transverse'),
            (22, 8, 'Cardio'),
            (23, 8, 'Tronc'),
            (24, 8, 'Full body'),
            (25, 1, 'Milieu des pectoraux'),
            (26, 1, 'Bas des pectoraux'),
            (27, 2, 'Chef latéral'),
            (28, 2, 'Chef médial'),
            (30, 6, 'Bracho-radial'),
            (31, 3, 'Soléaire'),
            (32, 3, 'Adducteurs'),
            (33, 3, 'Abducteurs')
        ON CONFLICT (id) DO NOTHING;

        SELECT setval('muscles_id_seq', (SELECT MAX(id) FROM public.muscles));
        """;

    @Override
    public boolean supports(Event event, Context context) {
        return event == Event.BEFORE_EACH_MIGRATE
            && VERSION_REQUIRING_MUSCLE_DATA.equals(context.getMigrationInfo().getVersion().toString());
    }

    @Override
    public boolean canHandleInTransaction(Event event, Context context) {
        return true;
    }

    @Override
    public void handle(Event event, Context context) {
        try (Statement statement = context.getConnection().createStatement()) {
            statement.execute(SEED_SQL);
        } catch (SQLException e) {
            throw new IllegalStateException("Failed to seed muscle reference data before migration V16", e);
        }
    }

    @Override
    public String getCallbackName() {
        return "muscleReferenceDataFlywayCallback";
    }
}
