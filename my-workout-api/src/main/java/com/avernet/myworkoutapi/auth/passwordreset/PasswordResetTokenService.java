package com.avernet.myworkoutapi.auth.passwordreset;

import com.avernet.myworkoutapi.user.UserEntity;
import com.avernet.myworkoutapi.user.UserNotFoundException;
import com.avernet.myworkoutapi.user.UserRepository;
import jakarta.annotation.Resource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Service
public class PasswordResetTokenService {

    @Resource
    UserRepository userRepository;

    @Resource
    PasswordResetTokenRepository passwordResetTokenRepository;

    @Resource
    BCryptPasswordEncoder passwordEncoder;

    @Value("${allowed.origin}")
    String allowedOrigin;


    @Transactional
    Map<String, String> generateLinkResetPassword(String email) {
        UserEntity userEntity = userRepository.findByEmail(email).orElseThrow(UserNotFoundException::new);

        String token = UUID.randomUUID().toString();

        PasswordResetTokenEntity passwordResetTokenEntity = PasswordResetTokenEntity.builder()
            .token(token)
            .user(userEntity)
            .used(false)
            .expirationDate(LocalDateTime.now().plusMinutes(15))
            .build();

        passwordResetTokenRepository.save(passwordResetTokenEntity);

        String linkResetPassword = new StringBuilder()
            .append(allowedOrigin)
            .append("/auth/")
            .append("reset-password")
            .append("?token=")
            .append(token)
            .toString();

        return Map.of("linkResetPassword", linkResetPassword);
    }

    @Transactional
    void resetPassword(ResetPasswordTokenPassword resetPasswordTokenPassword) {
        PasswordResetTokenEntity passwordResetTokenEntity = passwordResetTokenRepository.findByToken(resetPasswordTokenPassword.token());
        passwordResetTokenEntity.setUsed(true);

        UserEntity userEntity = passwordResetTokenEntity.getUser();
        userEntity.setPassword(passwordEncoder.encode(resetPasswordTokenPassword.password()));
        userEntity.setUpdatedAt(LocalDateTime.now());
    }

    @Transactional(readOnly = true)
    boolean isTokenValid(String token) {
        PasswordResetTokenEntity passwordResetToken = passwordResetTokenRepository.findByToken(token);
        return passwordResetToken != null && passwordResetToken.getUsed() == false && passwordResetToken.getExpirationDate().isAfter(LocalDateTime.now());
    }
}
