package com.avernet.my_workout_api.Muscle;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MuscleRepository extends CrudRepository<MuscleEntity, Long> {
}
