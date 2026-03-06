package com.avernet.myworkoutapi.musclegroup;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MuscleGroupRepository extends CrudRepository<MuscleGroupEntity, Long> {
}
