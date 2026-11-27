package com.avernet.myworkoutapi.error;

import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;

@Getter
@Setter
public class ApiErrorResponse {

    TypeError type;

    ErrorCodeEnum errorCode;

    String message;

    HttpStatus httpStatus;

    LocalDateTime timestamp = LocalDateTime.now();

    public ApiErrorResponse(ErrorCodeEnum errorCode, String message, HttpStatus httpStatus) {
        this(TypeError.BUSINESS, errorCode, message, httpStatus);
    }

    public ApiErrorResponse(TypeError type, ErrorCodeEnum errorCode, String message, HttpStatus httpStatus) {
        this.type = type;
        this.errorCode = errorCode;
        this.message = message;
        this.httpStatus = httpStatus;
    }
}
