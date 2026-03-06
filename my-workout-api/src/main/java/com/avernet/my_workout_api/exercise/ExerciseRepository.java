package com.avernet.my_workout_api.exercise;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExerciseRepository extends CrudRepository<ExerciseEntity, Long> {
}
