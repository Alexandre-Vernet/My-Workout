package com.avernet.my_workout_api.MuscleGroup;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MuscleGroupRepository extends CrudRepository<MuscleGroupEntity, Long> {
}
