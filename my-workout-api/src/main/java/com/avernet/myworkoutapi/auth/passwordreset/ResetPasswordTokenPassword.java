package com.avernet.myworkoutapi.auth.passwordreset;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ResetPasswordTokenPassword(
    @NotBlank(message = "Champ requis")
    String token,

    @NotBlank(message = "Champ requis")
    @Size(min = 6, max = 255, message = "Le mot de passe doit être compris entre 6 et 255 caractères")
    String password
) {
}
