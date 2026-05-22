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
    public LinkResetPasswordResponse generateLinkResetPassword(String email) {
        UserEntity userEntity = userRepository.findByEmail(email).orElseThrow(UserNotFoundException::new);

        String token = UUID.randomUUID().toString();

        PasswordResetTokenEntity passwordResetTokenEntity = PasswordResetTokenEntity.builder()
            .token(token)
            .user(userEntity)
            .used(false)
            .expirationDate(LocalDateTime.now().plusMinutes(15))
            .build();

        passwordResetTokenRepository.save(passwordResetTokenEntity);

        String link = allowedOrigin +
            "/auth/" +
            "reset-password" +
            "?token=" +
            token;

        return new LinkResetPasswordResponse(link);
    }

    @Transactional
    public void resetPassword(ResetPasswordTokenPassword resetPasswordTokenPassword) {
        PasswordResetTokenEntity passwordResetTokenEntity = passwordResetTokenRepository.findByToken(resetPasswordTokenPassword.token());
        passwordResetTokenEntity.setUsed(true);

        UserEntity userEntity = passwordResetTokenEntity.getUser();
        userEntity.setPassword(passwordEncoder.encode(resetPasswordTokenPassword.password()));
        userEntity.setUpdatedAt(LocalDateTime.now());
    }

    @Transactional(readOnly = true)
    public boolean isTokenValid(String token) {
        PasswordResetTokenEntity passwordResetToken = passwordResetTokenRepository.findByToken(token);
        return passwordResetToken != null && passwordResetToken.getUsed() == false && LocalDateTime.now().isBefore(passwordResetToken.getExpirationDate());
    }

    @Transactional
    public void deleteExpiredToken() {
        passwordResetTokenRepository.deleteByExpirationDateBefore(LocalDateTime.now());
    }
}
