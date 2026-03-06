package com.avernet.myworkoutapi.exercisemuscle;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExerciseMuscleRepository extends JpaRepository<ExerciseMuscleEntity, Long> {
}
