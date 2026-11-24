package com.avernet.myworkoutapi.exception;

import com.avernet.myworkoutapi.error.ApiErrorResponse;
import com.avernet.myworkoutapi.error.ErrorCodeEnum;
import com.avernet.myworkoutapi.error.FieldErrorResponse;
import com.avernet.myworkoutapi.error.FormError;
import com.avernet.myworkoutapi.error.TypeError;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.Nullable;
import org.springframework.context.MessageSourceResolvable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.method.annotation.HandlerMethodValidationException;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.util.List;

/**
 * Every error leaving the API goes through here, so clients only ever deal with two
 * contracts: {@link FormError} for validation errors, {@link ApiErrorResponse} for the rest.
 * Extending {@link ResponseEntityExceptionHandler} keeps Spring MVC's own exceptions
 * (unknown route, malformed body, bad parameter type...) on their proper 4xx status
 * instead of letting the catch-all below turn them into a 500.
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<ApiErrorResponse> handleApiException(ApiException apiException) {
        return ResponseEntity
            .status(apiException.getHttpStatus())
            .body(new ApiErrorResponse(apiException.getErrorCode(), apiException.getMessage(), apiException.getHttpStatus()));
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ApiErrorResponse> handleAuthenticationException(AuthenticationException authenticationException) {
        return ResponseEntity
            .status(HttpStatus.UNAUTHORIZED)
            .body(new ApiErrorResponse(ErrorCodeEnum.INVALID_CREDENTIALS, "Identifiants incorrects", HttpStatus.UNAUTHORIZED));
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiErrorResponse> handleAccessDeniedException(AccessDeniedException accessDeniedException) {
        return ResponseEntity
            .status(HttpStatus.FORBIDDEN)
            .body(new ApiErrorResponse(ErrorCodeEnum.ACCESS_DENIED, "Accès refusé", HttpStatus.FORBIDDEN));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleUnexpectedException(Exception exception) {
        log.error("Unexpected error", exception);
        return ResponseEntity
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(new ApiErrorResponse(TypeError.TECHNICAL, ErrorCodeEnum.INTERNAL_ERROR, "Une erreur interne est survenue", HttpStatus.INTERNAL_SERVER_ERROR));
    }

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException exception, HttpHeaders headers,
                                                                  HttpStatusCode status, WebRequest request) {
        List<FieldErrorResponse> fieldErrorResponseList = exception.getBindingResult().getFieldErrors()
            .stream()
            .map(fieldError -> new FieldErrorResponse(fieldError.getField(), fieldError.getDefaultMessage()))
            .toList();

        return ResponseEntity.badRequest().body(new FormError(fieldErrorResponseList));
    }

    @Override
    protected ResponseEntity<Object> handleHandlerMethodValidationException(HandlerMethodValidationException exception, HttpHeaders headers,
                                                                            HttpStatusCode status, WebRequest request) {
        List<FieldErrorResponse> fieldErrorResponseList = exception.getParameterValidationResults()
            .stream()
            .flatMap(result -> result.getResolvableErrors().stream()
                .map(MessageSourceResolvable::getDefaultMessage)
                .map(message -> new FieldErrorResponse(result.getMethodParameter().getParameterName(), message)))
            .toList();

        return ResponseEntity.badRequest().body(new FormError(fieldErrorResponseList));
    }

    @Override
    protected ResponseEntity<Object> handleExceptionInternal(Exception exception, @Nullable Object body, HttpHeaders headers,
                                                             HttpStatusCode statusCode, WebRequest request) {
        HttpStatus httpStatus = HttpStatus.valueOf(statusCode.value());
        ApiErrorResponse apiErrorResponse = switch (httpStatus) {
            case NOT_FOUND -> new ApiErrorResponse(TypeError.TECHNICAL, ErrorCodeEnum.RESOURCE_NOT_FOUND, "Ressource introuvable", httpStatus);
            case INTERNAL_SERVER_ERROR, SERVICE_UNAVAILABLE ->
                new ApiErrorResponse(TypeError.TECHNICAL, ErrorCodeEnum.INTERNAL_ERROR, "Une erreur interne est survenue", httpStatus);
            default -> new ApiErrorResponse(TypeError.TECHNICAL, ErrorCodeEnum.INVALID_REQUEST, "Requête invalide", httpStatus);
        };

        return ResponseEntity.status(httpStatus).headers(headers).body(apiErrorResponse);
    }
}
