package com.avernet.myworkoutapi.userexercise;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserExerciseRepository extends CrudRepository<UserExerciseEntity, Long> {
}
