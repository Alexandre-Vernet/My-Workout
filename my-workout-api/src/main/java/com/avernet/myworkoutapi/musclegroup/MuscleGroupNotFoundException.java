package com.avernet.myworkoutapi.musclegroup;

import com.avernet.myworkoutapi.exception.ApiException;
import com.avernet.myworkoutapi.exception.ErrorCodeEnum;
import org.springframework.http.HttpStatus;

public class MuscleGroupNotFoundException extends ApiException {
    public MuscleGroupNotFoundException() {
        super(ErrorCodeEnum.MUSCLE_GROUP_NOT_FOUND, "Ce groupe musculaire n'existe pas", HttpStatus.NOT_FOUND);
    }
}
