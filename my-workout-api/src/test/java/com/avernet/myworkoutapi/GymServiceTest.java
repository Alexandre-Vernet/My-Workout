package com.avernet.myworkoutapi;

import com.avernet.myworkoutapi.error.ErrorCodeEnum;
import com.avernet.myworkoutapi.exception.ApiException;
import com.avernet.myworkoutapi.gym.Gym;
import com.avernet.myworkoutapi.gym.GymEntity;
import com.avernet.myworkoutapi.gym.GymRepository;
import com.avernet.myworkoutapi.gym.GymService;
import com.avernet.myworkoutapi.user.User;
import com.avernet.myworkoutapi.user.UserEntity;
import com.avernet.myworkoutapi.user.UserNotFoundException;
import com.avernet.myworkoutapi.user.UserRepository;
import jakarta.annotation.Resource;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.function.Executable;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpStatus;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
@ActiveProfiles("test")
@Import(TestcontainersConfiguration.class)
@Sql(scripts = "/data.sql")
class GymServiceTest {

    @Resource
    private GymService service;

    @Resource
    private GymRepository gymRepository;

    @Resource
    private UserRepository userRepository;

    private UserEntity userEntity;
    private UserEntity otherUserEntity;

    @BeforeEach
    void setUp() {
        userEntity = userRepository.findById(1L).orElseThrow(UserNotFoundException::new);
        otherUserEntity = userRepository.findById(2L).orElseThrow(UserNotFoundException::new);
    }

    @Test
    void findGyms_shouldReturnOnlyActiveGymsOfTheUserOrderedById() {
        GymEntity first = saveGym("Salle A", true, userEntity);
        saveGym("Salle fermée", false, userEntity);
        GymEntity second = saveGym("Salle B", true, userEntity);
        saveGym("Salle d'un autre", true, otherUserEntity);

        List<Gym> gyms = service.findGyms(userEntity);

        assertEquals(List.of(first.getId(), second.getId()), gyms.stream().map(Gym::id).toList());
    }

    @Test
    void create_shouldCreateActiveGymForTheUser() {
        Gym created = service.create(userEntity, new Gym(null, "Basic Fit", null, null));

        assertNotNull(created.id());
        GymEntity gymEntity = gymRepository.findById(created.id()).orElseThrow();
        assertEquals("Basic Fit", gymEntity.getName());
        assertTrue(gymEntity.getActive());
        assertEquals(userEntity.getId(), gymEntity.getUser().getId());
    }

    @Test
    void create_shouldIgnoreUserSentInTheRequest() {
        User otherUser = User.builder().id(otherUserEntity.getId()).build();

        Gym created = service.create(userEntity, new Gym(null, "Salle", null, otherUser));

        GymEntity gymEntity = gymRepository.findById(created.id()).orElseThrow();
        assertEquals(userEntity.getId(), gymEntity.getUser().getId());
    }

    @Test
    void create_shouldReactivateDeletedGymWithSameName() {
        GymEntity deletedGym = saveGym("Salle A", false, userEntity);

        Gym created = service.create(userEntity, new Gym(null, "Salle A", null, null));

        assertEquals(deletedGym.getId(), created.id());
        assertTrue(gymRepository.findById(deletedGym.getId()).orElseThrow().getActive());
        assertEquals(1, gymRepository.findAll().stream().filter(g -> g.getName().equals("Salle A")).count());
    }

    @Test
    void update_shouldRenameGym() {
        GymEntity gymEntity = saveGym("Salle A", true, userEntity);

        Gym updated = service.update(userEntity, gymEntity.getId(), new Gym(null, "Salle renommée", null, null));

        assertEquals("Salle renommée", updated.name());
        assertEquals("Salle renommée", gymRepository.findById(gymEntity.getId()).orElseThrow().getName());
    }

    @Test
    void update_shouldRefuseGymOfAnotherUser() {
        GymEntity otherUserGym = saveGym("Salle d'un autre", true, otherUserEntity);

        assertGymNotFound(() -> service.update(userEntity, otherUserGym.getId(), new Gym(null, "Piratée", null, null)));
        assertEquals("Salle d'un autre", gymRepository.findById(otherUserGym.getId()).orElseThrow().getName());
    }

    @Test
    void delete_shouldSoftDeleteGym() {
        GymEntity gymEntity = saveGym("Salle A", true, userEntity);

        service.delete(userEntity, gymEntity.getId());

        GymEntity deletedGym = gymRepository.findById(gymEntity.getId()).orElseThrow();
        assertFalse(deletedGym.getActive());
        assertTrue(service.findGyms(userEntity).isEmpty());
    }

    @Test
    void delete_shouldRefuseGymOfAnotherUser() {
        GymEntity otherUserGym = saveGym("Salle d'un autre", true, otherUserEntity);

        assertGymNotFound(() -> service.delete(userEntity, otherUserGym.getId()));
        assertTrue(gymRepository.findById(otherUserGym.getId()).orElseThrow().getActive());
    }

    @Test
    void delete_shouldThrowWhenGymDoesNotExist() {
        assertGymNotFound(() -> service.delete(userEntity, 999_999L));
    }

    private GymEntity saveGym(String name, boolean active, UserEntity owner) {
        return gymRepository.save(GymEntity.builder().name(name).active(active).user(owner).build());
    }

    private static void assertGymNotFound(Executable executable) {
        ApiException exception = assertThrows(ApiException.class, executable);
        assertEquals(ErrorCodeEnum.GYM_NOT_FOUND, exception.getErrorCode());
        assertEquals(HttpStatus.NOT_FOUND, exception.getHttpStatus());
    }
}
