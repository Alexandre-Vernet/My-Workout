import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode, errorMessages } from '../../../../../libs/error-code/error-code';

export class CustomBadRequestException extends HttpException {
    constructor(errorCode: ErrorCode) {
        super({
            errorCode,
            message: errorMessages.get(errorCode)
        }, HttpStatus.BAD_REQUEST);
    }
}
