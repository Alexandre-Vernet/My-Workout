import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode, errorMessages } from '../../../../../libs/error-code/error-code';

export class FormBadRequestException extends HttpException {
    constructor(errorCode: ErrorCode, field: string) {
        super({
            errorCode,
            message: errorMessages.get(errorCode),
            field
        }, HttpStatus.BAD_REQUEST);
    }
}
