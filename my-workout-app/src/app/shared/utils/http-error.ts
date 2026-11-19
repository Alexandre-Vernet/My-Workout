import { FormGroup } from '@angular/forms';
import { CustomError } from '../../../interfaces/CustomError';

// `err.error` can be missing (timeout, unreachable server, CORS), so every access here stays optional.

export function getErrorCode(err: CustomError | null | undefined): string | undefined {
    return err?.error?.errorCode;
}

export function getErrorMessage(err: CustomError | null | undefined, fallback: string): string {
    return err?.error?.message ?? fallback;
}

export function isValidationError(err: CustomError | null | undefined): boolean {
    return err?.error?.type === 'VALIDATION';
}

export function applyValidationErrors(err: CustomError, formGroup: FormGroup) {
    err.error?.errors?.forEach(error => {
        formGroup.get(error.field)?.setErrors({ validation: error.message });
    });
}
