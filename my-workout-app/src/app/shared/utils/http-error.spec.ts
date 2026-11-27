import { FormControl, FormGroup } from '@angular/forms';
import { applyValidationErrors, getErrorCode, getErrorMessage, isValidationError } from './http-error';
import { CustomError } from '../../../interfaces/CustomError';

describe('http-error helpers', () => {
    it('getErrorCode returns undefined when err or err.error is missing', () => {
        expect(getErrorCode(undefined)).toBeUndefined();
        expect(getErrorCode({} as CustomError)).toBeUndefined();
    });

    it('getErrorCode reads the error code when present', () => {
        const err = { error: { errorCode: 'EMAIL_ALREADY_IN_USE' } } as CustomError;
        expect(getErrorCode(err)).toBe('EMAIL_ALREADY_IN_USE');
    });

    it('getErrorMessage falls back when err.error is missing (network error)', () => {
        expect(getErrorMessage(undefined, 'fallback')).toBe('fallback');
        expect(getErrorMessage({} as CustomError, 'fallback')).toBe('fallback');
    });

    it('getErrorMessage returns the server message when present', () => {
        const err = { error: { message: 'Erreur serveur' } } as CustomError;
        expect(getErrorMessage(err, 'fallback')).toBe('Erreur serveur');
    });

    it('isValidationError checks the error type', () => {
        expect(isValidationError({ error: { type: 'VALIDATION' } } as CustomError)).toBe(true);
        expect(isValidationError({ error: { type: 'BUSINESS' } } as CustomError)).toBe(false);
        expect(isValidationError(undefined)).toBe(false);
    });

    it('applyValidationErrors sets a validation error on each matching form control', () => {
        const formGroup = new FormGroup({
            email: new FormControl(''),
            password: new FormControl('')
        });
        const err = {
            error: {
                type: 'VALIDATION',
                errors: [
                    { field: 'email', message: 'Email invalide' }
                ]
            }
        } as CustomError;

        applyValidationErrors(err, formGroup);

        expect(formGroup.controls.email.errors).toEqual({ validation: 'Email invalide' });
        expect(formGroup.controls.password.errors).toBeNull();
    });
});
