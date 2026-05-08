package com.avernet.myworkoutapi.user;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {
    Long id;

    @Email(message = "Ce champ doit être au format email")
    @NotBlank(message = "Champ requis")
    String email;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Size(min = 6, max = 255, message = "Le mot de passe doit être compris entre 6 et 255 caractères")
    @NotBlank(message = "Champ requis")
    String password;

    LocalDateTime createdAt;

    LocalDateTime updatedAt;

    Boolean admin;
}
