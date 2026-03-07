package com.avernet.myworkoutapi.muscle;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MuscleRepository extends JpaRepository<MuscleEntity, Long> {

    List<MuscleEntity> findAllByOrderByMuscleGroupTypeAsc();
}
