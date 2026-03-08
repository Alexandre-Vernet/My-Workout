package com.avernet.myworkoutapi.auth;

import com.avernet.myworkoutapi.config.JwtService;
import com.avernet.myworkoutapi.exception.ApiException;
import com.avernet.myworkoutapi.exception.ErrorCodeEnum;
import com.avernet.myworkoutapi.user.User;
import com.avernet.myworkoutapi.user.UserEntity;
import com.avernet.myworkoutapi.user.UserMapper;
import com.avernet.myworkoutapi.user.UserRepository;
import jakarta.annotation.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;

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

    private UserEntity getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal() != null && authentication.getPrincipal().equals("anonymousUser")) {
            throw new SecurityException("Utilisateur non authentifié");
        }

        return (UserEntity) authentication.getPrincipal();
    }

    public UserEntity getCurrentUserEntity() {
        return getCurrentUser();
    }

    public User getCurrentUserDto() {
      UserEntity userEntity = getCurrentUser();
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

        return new AuthResponse(jwtToken);
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

    public User getUserByEmail(String email) {
        UserEntity userEntity = userRepository.findByEmail(email).orElseThrow(() -> new ApiException(ErrorCodeEnum.USER_NOT_FOUND, "Utilisateur introuvable", HttpStatus.BAD_REQUEST));
        return userMapper.toDto(userEntity);
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
        UserEntity userEntity = userRepository.findById(id).orElseThrow(() -> new ApiException(ErrorCodeEnum.USER_NOT_FOUND, "Utilisateur introuvable", HttpStatus.BAD_REQUEST));
        userEntity.setPassword(passwordEncoder.encode(newPassword));
    }
}
