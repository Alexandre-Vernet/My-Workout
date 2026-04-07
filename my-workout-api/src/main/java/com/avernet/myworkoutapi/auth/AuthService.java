package com.avernet.myworkoutapi.auth;

import com.avernet.myworkoutapi.exception.ApiException;
import com.avernet.myworkoutapi.exception.ErrorCodeEnum;
import com.avernet.myworkoutapi.user.UserNotFoundException;
import com.avernet.myworkoutapi.user.User;
import com.avernet.myworkoutapi.user.UserEntity;
import com.avernet.myworkoutapi.user.UserMapper;
import com.avernet.myworkoutapi.user.UserRepository;
import jakarta.annotation.Resource;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

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

        if (authentication == null || !authentication.isAuthenticated() ||
            authentication.getPrincipal() != null &&
                authentication.getPrincipal().equals("anonymousUser")) {
            throw new ApiException(ErrorCodeEnum.INVALID_USER, "Utilisateur non authentifié", HttpStatus.FORBIDDEN);
        }

        try {
            return Optional.ofNullable((UserEntity) authentication.getPrincipal());
        } catch (Exception exception) {
            return Optional.empty();
        }
    }

    public User getCurrentUser(UserEntity userEntity) {
        return userMapper.toDto(userEntity);
    }

    public AuthResponse loginUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                loginRequest.email(),
                loginRequest.password()
            )
        );

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String jwtToken = jwtService.generateToken(userDetails);
        String refreshToken = jwtService.generateRefreshToken(userDetails);

        return new AuthResponse(jwtToken, refreshToken);
    }

    public User registerUser(User user) {
        boolean userExist = userRepository.existsByEmail(user.getEmail());
        if (userExist) {
            throw new ApiException(ErrorCodeEnum.EMAIL_ALREADY_IN_USE, "Cet email est déjà utilisé", HttpStatus.BAD_REQUEST);
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        UserEntity userEntity = userRepository.save(userMapper.toEntity(user));

        return userMapper.toDto(userEntity);
    }

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

    public Map<String, String> sendEmailForgotPassword(String email) {
        UserEntity userEntity = userRepository.findByEmail(email).orElseThrow(() -> new ApiException(ErrorCodeEnum.USER_NOT_FOUND, "Utilisateur introuvable", HttpStatus.BAD_REQUEST));

        UserDetails userDetails = UserEntity.builder()
            .id(userEntity.getId())
            .email(userEntity.getEmail())
            .build();

        String token = jwtService.generateToken(userDetails);
        return Map.of("token", token);
    }


    public void updatePassword(Long id, String newPassword) {
        UserEntity userEntity = userRepository.findById(id).orElseThrow(UserNotFoundException::new);
        userEntity.setPassword(passwordEncoder.encode(newPassword));
    }
}
