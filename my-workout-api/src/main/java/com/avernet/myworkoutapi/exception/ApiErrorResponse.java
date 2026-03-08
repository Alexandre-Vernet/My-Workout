package com.avernet.myworkoutapi.exception;

import org.springframework.http.HttpStatus;

public record ApiErrorResponse(ErrorCodeEnum errorCode, String message, HttpStatus httpStatus) {
}
