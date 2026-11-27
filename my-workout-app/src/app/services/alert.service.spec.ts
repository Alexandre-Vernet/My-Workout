import { AlertService } from './alert.service';

describe('AlertService', () => {
    it('starts with no alert', () => {
        const service = new AlertService();
        expect(service.alert()).toBeNull();
    });

    it('show() updates the alert signal', () => {
        const service = new AlertService();

        service.show({ severity: 'success', message: 'Saved' });

        expect(service.alert()).toEqual({ severity: 'success', message: 'Saved' });
    });

    it('show(null) clears the current alert', () => {
        const service = new AlertService();
        service.show({ severity: 'error', message: 'Oops' });

        service.show(null);

        expect(service.alert()).toBeNull();
    });
});
