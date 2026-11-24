package com.avernet.myworkoutapi.auth;

import com.avernet.myworkoutapi.error.ErrorCodeEnum;
import com.avernet.myworkoutapi.exception.ApiException;
import com.avernet.myworkoutapi.ratelimit.AttemptLimiter;
import com.avernet.myworkoutapi.user.UpdateUser;
import com.avernet.myworkoutapi.user.User;
import com.avernet.myworkoutapi.user.UserEntity;
import com.avernet.myworkoutapi.user.UserMapper;
import com.avernet.myworkoutapi.user.UserNotFoundException;
import com.avernet.myworkoutapi.user.UserRepository;
import io.jsonwebtoken.JwtException;
import jakarta.annotation.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class AuthService {

    @Resource
    UserRepository userRepository;

    @Resource
    BCryptPasswordEncoder passwordEncoder;

    @Resource
    AuthenticationManager authenticationManager;

    @Resource
    JwtService jwtService;

    @Resource
    UserMapper userMapper;

    @Resource
    AttemptLimiter loginAttemptLimiter;


    public Optional<UserEntity> optionalUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.isAuthenticated()
            && !(authentication instanceof AnonymousAuthenticationToken)) {

            UserEntity user = (UserEntity) authentication.getPrincipal();
            return Optional.ofNullable(user);
        }

        return Optional.empty();
    }

    @Transactional(readOnly = true)
    public User getCurrentUser(UserEntity userEntity) {
        userEntity = userRepository.findById(userEntity.getId()).orElseThrow(UserNotFoundException::new);
        return userMapper.toDto(userEntity);
    }

    @Transactional(readOnly = true)
    public AuthResponse loginUser(LoginRequest loginRequest) {
        String email = loginRequest.getEmail();
        if (loginAttemptLimiter.isBlocked(email)) {
            throw new ApiException(ErrorCodeEnum.TOO_MANY_ATTEMPTS, "Trop de tentatives de connexion, réessayez dans quelques minutes", HttpStatus.TOO_MANY_REQUESTS);
        }

        Authentication authentication;
        try {
            authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, loginRequest.getPassword())
            );
        } catch (AuthenticationException e) {
            loginAttemptLimiter.recordAttempt(email);
            throw e;
        }
        loginAttemptLimiter.reset(email);

        return generateTokens((UserEntity) authentication.getPrincipal());
    }

    @Transactional
    public User registerUser(RegisterRequest registerRequest) {
        if (!registerRequest.getPassword().equals(registerRequest.getConfirmPassword())) {
            throw new ApiException(ErrorCodeEnum.PASSWORD_NOT_MATCH, "Les mots de passes ne correspondent pas", HttpStatus.BAD_REQUEST);
        }

        boolean userExist = userRepository.existsByEmail(registerRequest.getEmail());
        if (userExist) {
            throw new ApiException(ErrorCodeEnum.EMAIL_ALREADY_IN_USE, "Cet email est déjà utilisé", HttpStatus.CONFLICT);
        }

        registerRequest.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        UserEntity userEntity = UserEntity.builder()
            .email(registerRequest.getEmail())
            .password(registerRequest.getPassword())
            .build();

        UserEntity userCreated = userRepository.save(userEntity);

        return userMapper.toDto(userCreated);
    }

    @Transactional(readOnly = true)
    public AuthResponse refreshToken(String refreshToken) {
        try {
            UserEntity userEntity = userRepository.findByEmail(jwtService.extractUsername(refreshToken))
                .filter(user -> jwtService.isRefreshTokenValid(refreshToken, user))
                .orElseThrow(AuthService::invalidToken);

            return generateTokens(userEntity);
        } catch (JwtException | IllegalArgumentException e) {
            throw invalidToken();
        }
    }

    @Transactional
    public User update(UserEntity userEntity, UpdateUser user) {
        userEntity = userRepository.findById(userEntity.getId()).orElseThrow(UserNotFoundException::new);
        boolean credentialsChanged = false;

        if (user.getEmail() != null && !userEntity.getEmail().equals(user.getEmail())) {
            boolean userExist = userRepository.existsByEmail(user.getEmail());
            if (userExist) {
                throw new ApiException(ErrorCodeEnum.EMAIL_ALREADY_IN_USE, "Cet email est déjà utilisé", HttpStatus.CONFLICT);
            }
            userEntity.setEmail(user.getEmail());
            credentialsChanged = true;
        }

        if (user.getPassword() != null) {
            userEntity.setPassword(passwordEncoder.encode(user.getPassword()));
            credentialsChanged = true;
        }

        if (credentialsChanged) {
            userEntity.revokeTokens();
        }

        return userMapper.toDto(userEntity);
    }

    // Reloaded here rather than deleting the principal as-is: it comes from the security
    // context (detached, collections never loaded), and the cascades on UserEntity need a
    // managed entity to remove workouts, gyms, added exercises and reset tokens with it.
    @Transactional
    public void deleteUser(UserEntity userEntity) {
        userRepository.findById(userEntity.getId()).ifPresent(userRepository::delete);
    }

    private AuthResponse generateTokens(UserEntity userEntity) {
        return new AuthResponse(jwtService.generateAccessToken(userEntity), jwtService.generateRefreshToken(userEntity));
    }

    private static ApiException invalidToken() {
        return new ApiException(ErrorCodeEnum.INVALID_TOKEN, "Token invalide", HttpStatus.UNAUTHORIZED);
    }
}
