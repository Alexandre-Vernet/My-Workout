package com.avernet.myworkoutapi.error;

public record FieldErrorResponse(
    String field,
    String message
) {
}
