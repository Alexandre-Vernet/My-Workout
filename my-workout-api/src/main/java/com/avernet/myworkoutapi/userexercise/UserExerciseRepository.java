package com.avernet.myworkoutapi.userexercise;

import org.springframework.data.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserExerciseRepository extends JpaRepository<UserExerciseEntity, Long> {
}
