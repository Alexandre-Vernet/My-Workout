import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { GymService } from './gym.service';
import { Gym } from '../../interfaces/gym';

describe('GymService', () => {
    let service: GymService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideHttpClient(), provideHttpClientTesting()]
        });

        service = TestBed.inject(GymService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('findAll() GETs the gym list', () => {
        const gyms: Gym[] = [{ id: 1, name: 'Basic Fit', user: { id: 1, email: 'a@b.com' } }];
        let result: Gym[] | undefined;

        service.findAll().subscribe(res => result = res);

        const req = httpMock.expectOne(service.gymUrl);
        expect(req.request.method).toBe('GET');
        req.flush(gyms);

        expect(result).toEqual(gyms);
    });

    it('create() POSTs the gym name', () => {
        const gym: Gym = { id: 1, name: 'Basic Fit', user: { id: 1, email: 'a@b.com' } };
        let result: Gym | undefined;

        service.create('Basic Fit').subscribe(res => result = res);

        const req = httpMock.expectOne(service.gymUrl);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual({ name: 'Basic Fit' });
        req.flush(gym);

        expect(result).toEqual(gym);
    });

    it('update() PATCHes the gym name at /gym/{gymId}', () => {
        const gym: Gym = { id: 1, name: 'New name', user: { id: 1, email: 'a@b.com' } };
        let result: Gym | undefined;

        service.update(1, 'New name').subscribe(res => result = res);

        const req = httpMock.expectOne(`${ service.gymUrl }/1`);
        expect(req.request.method).toBe('PATCH');
        expect(req.request.body).toEqual({ name: 'New name' });
        req.flush(gym);

        expect(result).toEqual(gym);
    });

    it('delete() DELETEs the gym at /gym/{gymId}', () => {
        service.delete(1).subscribe();

        const req = httpMock.expectOne(`${ service.gymUrl }/1`);
        expect(req.request.method).toBe('DELETE');
        expect(req.request.body).toBeNull();
        req.flush(null);
    });
});
