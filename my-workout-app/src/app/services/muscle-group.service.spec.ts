import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { MuscleGroupService } from './muscle-group.service';

describe('MuscleGroupService', () => {
    let service: MuscleGroupService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideHttpClient(), provideHttpClientTesting()]
        });

        service = TestBed.inject(MuscleGroupService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('findAllMuscleGroup() GETs every muscle group', () => {
        service.findAllMuscleGroup().subscribe();

        const req = httpMock.expectOne(service.muscleGroupUrl);
        expect(req.request.method).toBe('GET');
        req.flush([]);
    });

    it('findAllRecommendedMuscleGroup() GETs the recommended muscle groups', () => {
        service.findAllRecommendedMuscleGroup().subscribe();

        httpMock.expectOne(`${ service.muscleGroupUrl }/recommended`).flush([]);
    });
});
