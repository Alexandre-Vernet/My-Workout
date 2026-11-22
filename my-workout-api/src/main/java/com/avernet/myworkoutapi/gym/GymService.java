package com.avernet.myworkoutapi.gym;

import com.avernet.myworkoutapi.error.ErrorCodeEnum;
import com.avernet.myworkoutapi.exception.ApiException;
import com.avernet.myworkoutapi.user.UserEntity;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import jakarta.annotation.Resource;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class GymService {

    @Resource
    private GymRepository gymRepository;

    @Resource
    private GymMapper gymMapper;

    @Transactional(readOnly = true)
    public List<Gym> findGyms(UserEntity userEntity) {
        return gymRepository.findByUserAndActiveTrueOrderByIdAsc(userEntity).stream().map(gymMapper::toDto).toList();
    }

    @Transactional
    public Gym create(UserEntity userEntity, Gym gym) {
        Optional<GymEntity> gymEntityExist = gymRepository.findByNameAndUser(gym.name(), userEntity);
        if (gymEntityExist.isPresent()) {
            gymEntityExist.get().setActive(true);
            return gymMapper.toDto(gymEntityExist.get());
        }

        GymEntity gymEntity = gymMapper.toEntity(gym);
        gymEntity.setUser(userEntity);
        gymEntity.setActive(true);

        GymEntity gymCreated = gymRepository.save(gymEntity);

        return gymMapper.toDto(gymCreated);
    }

    @Transactional
    public Gym update(UserEntity userEntity, Long gymId, Gym gym) {
        GymEntity gymEntity = gymRepository.findByIdAndUser(gymId, userEntity)
            .orElseThrow(() -> new ApiException(ErrorCodeEnum.GYM_NOT_FOUND, "Cette salle n'existe pas", HttpStatus.NOT_FOUND));

        gymEntity.setName(gym.name());

        return gymMapper.toDto(gymEntity);
    }

    @Transactional
    public void delete(UserEntity userEntity, Long gymId) {
        GymEntity gymEntity = gymRepository.findByIdAndUser(gymId, userEntity)
            .orElseThrow(() -> new ApiException(ErrorCodeEnum.GYM_NOT_FOUND, "Cette salle n'existe pas", HttpStatus.NOT_FOUND));

        gymEntity.setActive(false);
    }
}
