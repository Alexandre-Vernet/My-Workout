package com.avernet.myworkoutapi.user;

import com.avernet.myworkoutapi.exception.ApiException;
import com.avernet.myworkoutapi.exception.ErrorCodeEnum;
import org.springframework.http.HttpStatus;

public class UserNotFoundException extends ApiException {
    public UserNotFoundException() {
        super(ErrorCodeEnum.USER_NOT_FOUND, "Cet utilisateur n'existe pas", HttpStatus.NOT_FOUND);
    }
}
