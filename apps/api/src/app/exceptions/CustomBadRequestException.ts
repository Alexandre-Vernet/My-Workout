import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode } from '../../../../../libs/error-code/error-code';

export class CustomBadRequestException extends HttpException {
    constructor(errorCode: ErrorCode, message: string) {
        super({
            errorCode,
            message
        }, HttpStatus.BAD_REQUEST);
    }
}
