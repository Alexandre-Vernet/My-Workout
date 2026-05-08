package com.avernet.myworkoutapi.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUser {

    @Email(message = "Ce champ doit être au format email")
    @NotBlank(message = "Champ requis")
    String email;

    @Size(min = 6, max = 255, message = "Le mot de passe doit être compris entre 6 et 255 caractères")
    String password;

    String confirmPassword;
}
