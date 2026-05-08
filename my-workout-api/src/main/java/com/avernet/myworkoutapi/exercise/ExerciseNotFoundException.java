package com.avernet.myworkoutapi.exercise;

import com.avernet.myworkoutapi.exception.ApiException;
import com.avernet.myworkoutapi.error.ErrorCodeEnum;
import org.springframework.http.HttpStatus;

public class ExerciseNotFoundException extends ApiException {
    public ExerciseNotFoundException() {
        super(ErrorCodeEnum.EXERCISE_NOT_FOUND, "Cet exercice n'existe pas", HttpStatus.NOT_FOUND);
    }
}
