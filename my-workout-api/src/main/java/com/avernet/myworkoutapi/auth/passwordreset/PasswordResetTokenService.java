package com.avernet.myworkoutapi.auth.passwordreset;

import com.avernet.myworkoutapi.error.ErrorCodeEnum;
import com.avernet.myworkoutapi.exception.ApiException;
import com.avernet.myworkoutapi.ratelimit.AttemptLimiter;
import com.avernet.myworkoutapi.user.UserEntity;
import com.avernet.myworkoutapi.user.UserRepository;
import jakarta.annotation.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class PasswordResetTokenService {

    @Resource
    UserRepository userRepository;

    @Resource
    PasswordResetTokenRepository passwordResetTokenRepository;

    @Resource
    BCryptPasswordEncoder passwordEncoder;

    @Resource
    PasswordResetMailService passwordResetMailService;

    @Resource
    AttemptLimiter passwordResetAttemptLimiter;


    // Over the limit, the request is dropped silently, exactly like an unknown email: answering
    // differently would let anyone probe which emails have an account.
    @Transactional
    public void generatePasswordResetToken(String email) {
        if (!passwordResetAttemptLimiter.tryAcquire(email)) {
            return;
        }

        Optional<UserEntity> userEntity = userRepository.findByEmail(email);
        if (userEntity.isEmpty()) {
            return;
        }

        String token = UUID.randomUUID().toString();

        PasswordResetTokenEntity passwordResetTokenEntity = PasswordResetTokenEntity.builder()
            .token(token)
            .user(userEntity.get())
            .used(false)
            .expirationDate(LocalDateTime.now().plusMinutes(15))
            .build();

        passwordResetTokenRepository.save(passwordResetTokenEntity);

        passwordResetMailService.sendPasswordResetEmail(userEntity.get().getEmail(), token);
    }

    @Transactional
    public void resetPassword(ResetPasswordTokenPassword resetPasswordTokenPassword) {
        PasswordResetTokenEntity passwordResetTokenEntity = passwordResetTokenRepository.findByToken(resetPasswordTokenPassword.token());

        boolean isValid = passwordResetTokenEntity != null
            && !passwordResetTokenEntity.getUsed()
            && LocalDateTime.now().isBefore(passwordResetTokenEntity.getExpirationDate());

        if (!isValid) {
            throw new ApiException(ErrorCodeEnum.INVALID_TOKEN, "Token invalide ou expiré", HttpStatus.FORBIDDEN);
        }

        passwordResetTokenEntity.setUsed(true);

        UserEntity userEntity = passwordResetTokenEntity.getUser();
        userEntity.setPassword(passwordEncoder.encode(resetPasswordTokenPassword.password()));
        userEntity.setUpdatedAt(LocalDateTime.now());
        // A reset is typically done because the account may be compromised: sessions opened
        // before it (possibly by someone else) must not survive it.
        userEntity.revokeTokens();
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
