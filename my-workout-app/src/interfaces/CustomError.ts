import { HttpStatusCode } from "@angular/common/http";

export interface CustomError {
    error?: {
        /*CustomError business*/
        message: string;

        /*CustomError validation*/
        errors: {
            field: string;
            message: string;
        }[];

        type: 'BUSINESS' | 'VALIDATION';
        errorCode: string;
        httpStatus: HttpStatusCode;
    }
}
