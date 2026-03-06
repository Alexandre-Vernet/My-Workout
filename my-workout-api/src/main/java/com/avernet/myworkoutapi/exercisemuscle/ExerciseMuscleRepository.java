package com.avernet.myworkoutapi.exercisemuscle;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExerciseMuscleRepository extends CrudRepository<ExerciseMuscleEntity, Long> {
}
