import { HttpStatusCode } from "@angular/common/http";

export class Error {
    error: {
        /*Error business*/
        message: string;

        /*Error validation*/
        errors: {
            field: string;
            message: string;
        }[];

        type: 'BUSINESS' | 'VALIDATION';
        errorCode: string;
        httpStatus: HttpStatusCode;
    }
}
