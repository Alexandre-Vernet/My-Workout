package com.avernet.myworkoutapi.workout;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface WorkoutRepository extends JpaRepository<WorkoutEntity, Long> {

    Optional<WorkoutEntity> findByUserIdAndMuscleGroupIdAndDate(Long userId, Long muscleGroupId, LocalDate date);
}
