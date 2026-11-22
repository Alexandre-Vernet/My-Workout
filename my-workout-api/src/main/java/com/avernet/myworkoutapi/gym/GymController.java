package com.avernet.myworkoutapi.gym;

import com.avernet.myworkoutapi.user.UserEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.annotation.Resource;

import java.util.List;

@RestController
@RequestMapping("gym")
public class GymController {

    @Resource
    private GymService gymService;

    @GetMapping
    List<Gym> findGym(@AuthenticationPrincipal UserEntity userEntity) {
        return gymService.findGyms(userEntity);
    }

    @PostMapping
    Gym create(@AuthenticationPrincipal UserEntity userEntity, @RequestBody Gym gym) {
        return gymService.create(userEntity, gym);
    }

    @PatchMapping("{gymId}")
    Gym update(@AuthenticationPrincipal UserEntity userEntity, @PathVariable Long gymId, @RequestBody Gym gym) {
        return gymService.update(userEntity, gymId, gym);
    }

    @DeleteMapping("{gymId}")
    void delete(@AuthenticationPrincipal UserEntity userEntity, @PathVariable Long gymId) {
        gymService.delete(userEntity, gymId);
    }
}
