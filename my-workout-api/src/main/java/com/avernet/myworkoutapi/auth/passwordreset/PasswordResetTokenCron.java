package com.avernet.myworkoutapi.auth.passwordreset;

import jakarta.annotation.Resource;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class PasswordResetTokenCron {

    @Resource
    PasswordResetTokenService passwordResetTokenService;


    @Scheduled(cron = "0 0 3 * * *")
    public void deleteExpiredToken() {
        passwordResetTokenService.deleteExpiredToken();
    }
}
