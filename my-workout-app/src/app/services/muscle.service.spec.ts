import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { MuscleService } from './muscle.service';

describe('MuscleService', () => {
    let service: MuscleService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideHttpClient(), provideHttpClientTesting()]
        });

        service = TestBed.inject(MuscleService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('findAllMuscles() GETs the muscle dropdown groups', () => {
        let result: unknown;
        service.findAllMuscles().subscribe(res => result = res);

        const req = httpMock.expectOne(service.muscleUrl);
        expect(req.request.method).toBe('GET');
        req.flush([{ label: 'Pectoraux', value: 'pectoraux', items: [] }]);

        expect(result).toEqual([{ label: 'Pectoraux', value: 'pectoraux', items: [] }]);
    });
});
