package com.avernet.my_workout_api.ExerciseMuscle;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExerciseMuscleRepository extends CrudRepository<ExerciseMuscleEntity, Long> {
}
