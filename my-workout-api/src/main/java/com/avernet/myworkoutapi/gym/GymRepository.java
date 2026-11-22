package com.avernet.myworkoutapi.gym;

import com.avernet.myworkoutapi.user.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface GymRepository extends JpaRepository<GymEntity, Long> {

    List<GymEntity> findByUserAndActiveTrueOrderByIdAsc(UserEntity user);


    Optional<GymEntity> findByIdAndUser(Long id, UserEntity userEntity);

    Optional<GymEntity> findByNameAndUser(String name, UserEntity userEntity);
}
