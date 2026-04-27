package com.avernet.myworkoutapi.auth;

import com.avernet.myworkoutapi.exception.ApiException;
import com.avernet.myworkoutapi.error.ErrorCodeEnum;
import com.avernet.myworkoutapi.user.UpdateUser;
import com.avernet.myworkoutapi.user.UserNotFoundException;
import com.avernet.myworkoutapi.user.User;
import com.avernet.myworkoutapi.user.UserEntity;
import com.avernet.myworkoutapi.user.UserMapper;
import com.avernet.myworkoutapi.user.UserRepository;
import jakarta.annotation.Resource;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
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

    private final UserDetailsService userDetailsService;


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
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                loginRequest.getEmail(),
                loginRequest.getPassword()
            )
        );

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String jwtToken = jwtService.generateToken(userDetails);
        String refreshToken = jwtService.generateRefreshToken(userDetails);

        return new AuthResponse(jwtToken, refreshToken);
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
        String email = jwtService.extractUsername(refreshToken);

        UserDetails userDetails = userDetailsService.loadUserByUsername(email);

        if (jwtService.isTokenValid(refreshToken, userDetails)) {
            String jwtToken = jwtService.generateToken(userDetails);
            refreshToken = jwtService.generateRefreshToken(userDetails);

            return new AuthResponse(jwtToken, refreshToken);
        }

        throw new ApiException(ErrorCodeEnum.INVALID_TOKEN, "Token invalide", HttpStatus.FORBIDDEN);
    }

    @Transactional
    public User update(UserEntity userEntity, UpdateUser user) {
        userEntity = userRepository.findById(userEntity.getId()).orElseThrow(UserNotFoundException::new);
        if (user.getEmail() != null && !userEntity.getEmail().equals(user.getEmail())) {
            boolean userExist = userRepository.existsByEmail(user.getEmail());
            if (userExist) {
                throw new ApiException(ErrorCodeEnum.EMAIL_ALREADY_IN_USE, "Cet email est déjà utilisé", HttpStatus.CONFLICT);
            }
            userEntity.setEmail(user.getEmail());
        }

        if (user.getPassword() != null) {
            userEntity.setPassword(passwordEncoder.encode(user.getPassword()));
        }

        return userMapper.toDto(userEntity);
    }

    @Transactional
    void deleteUser(UserEntity userEntity) {
        userRepository.delete(userEntity);
    }

    public Map<String, String> sendEmailForgotPassword(String email) {
        UserEntity userEntity = userRepository.findByEmail(email).orElseThrow(() -> new ApiException(ErrorCodeEnum.USER_NOT_FOUND, "Utilisateur introuvable", HttpStatus.BAD_REQUEST));

        UserDetails userDetails = UserEntity.builder()
            .id(userEntity.getId())
            .email(userEntity.getEmail())
            .build();

        String token = jwtService.generateToken(userDetails);
        return Map.of("token", token);
    }
}
