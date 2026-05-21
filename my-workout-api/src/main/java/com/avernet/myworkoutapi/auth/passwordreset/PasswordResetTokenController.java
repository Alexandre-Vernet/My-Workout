package com.avernet.myworkoutapi.auth.passwordreset;

import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("password-reset-token")
public class PasswordResetTokenController {

    @Resource
    PasswordResetTokenService passwordResetTokenService;

    @GetMapping("forgot-password")
    Map<String, String> generateLinkResetPassword(@RequestParam("email") String email) {
        return passwordResetTokenService.generateLinkResetPassword(email);
    }

    @GetMapping("is-token-valid")
    boolean isTokenValid(@RequestParam("token") String token) {
        return passwordResetTokenService.isTokenValid(token);
    }

    @PostMapping("reset-password")
    void resetPassword(@RequestBody ResetPasswordTokenPassword resetPasswordTokenPassword) {
        passwordResetTokenService.resetPassword(resetPasswordTokenPassword);
    }
}
