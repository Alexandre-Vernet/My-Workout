package com.avernet.myworkoutapi.auth.passwordreset;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetTokenEntity, Long> {

    PasswordResetTokenEntity findByToken(String token);

    void deleteByExpirationDateBefore(LocalDateTime expirationDateBefore);
}
