package com.avernet.myworkoutapi.auth.passwordreset;

import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("password-reset-token")
public class PasswordResetTokenController {

    @Resource
    PasswordResetTokenService passwordResetTokenService;

    @GetMapping("forgot-password")
    void generatePasswordResetToken(@RequestParam("email") @NotBlank(message = "Champ requis") @Email(message = "Ce champ doit être au format email") String email) {
        passwordResetTokenService.generatePasswordResetToken(email);
    }

    @GetMapping("valid")
    boolean isTokenValid(@RequestParam("token") @NotBlank(message = "Champ requis") String token) {
        return passwordResetTokenService.isTokenValid(token);
    }

    @PostMapping("reset-password")
    void resetPassword(@Valid @RequestBody ResetPasswordTokenPassword resetPasswordTokenPassword) {
        passwordResetTokenService.resetPassword(resetPasswordTokenPassword);
    }
}
