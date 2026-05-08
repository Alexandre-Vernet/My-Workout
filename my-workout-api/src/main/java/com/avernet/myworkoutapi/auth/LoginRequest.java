package com.avernet.myworkoutapi.auth;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class LoginRequest {

    @Email(message = "Ce champ doit être au format email")
    @NotBlank(message = "Champ requis")
    String email;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Size(min = 6, max = 255, message = "Le mot de passe doit être compris entre 6 et 255 caractères")
    @NotBlank(message = "Champ requis")
    String password;
}
