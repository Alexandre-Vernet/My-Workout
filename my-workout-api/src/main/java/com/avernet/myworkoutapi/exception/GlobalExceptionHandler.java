package com.avernet.myworkoutapi.exception;

import com.avernet.myworkoutapi.error.ApiErrorResponse;
import com.avernet.myworkoutapi.error.FieldErrorResponse;
import com.avernet.myworkoutapi.error.FormError;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.List;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<?> exceptionHandler(ApiException apiException) {
        return new ResponseEntity<>(
            new ApiErrorResponse(
                apiException.getErrorCode(),
                apiException.getMessage(),
                apiException.getHttpStatus()
            ),
            apiException.getHttpStatus());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> exceptionHandler(MethodArgumentNotValidException methodArgumentNotValidException) {
        List<FieldErrorResponse> fieldErrorResponseList = methodArgumentNotValidException.getBindingResult().getFieldErrors()
            .stream()
            .map(fieldError -> new FieldErrorResponse(fieldError.getField(), fieldError.getDefaultMessage()))
            .toList();

        FormError formError = new FormError(fieldErrorResponseList);

        return ResponseEntity.badRequest().body(formError);
    }
}
