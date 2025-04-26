import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode } from '../../../../../libs/error-code/error-code';

export class FormBadRequestException extends HttpException {
    constructor(errorCode: ErrorCode, message: string, field: string) {
        super({
            errorCode,
            message,
            field
        }, HttpStatus.BAD_REQUEST);
    }
}
