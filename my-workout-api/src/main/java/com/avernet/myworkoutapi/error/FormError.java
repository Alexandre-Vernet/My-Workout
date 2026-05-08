package com.avernet.myworkoutapi.error;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class FormError {

    TypeError type = TypeError.VALIDATION;

    @JsonProperty("errors")
    List<FieldErrorResponse> fieldErrorResponseList;

    HttpStatus httpStatus = HttpStatus.BAD_REQUEST;

    LocalDateTime timestamp = LocalDateTime.now();

    public FormError(List<FieldErrorResponse> fieldErrorResponseList) {
        this.fieldErrorResponseList = fieldErrorResponseList;
    }
}
