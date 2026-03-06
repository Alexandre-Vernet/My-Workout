package com.avernet.myworkoutapi.muscle;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MuscleRepository extends CrudRepository<MuscleEntity, Long> {
}
