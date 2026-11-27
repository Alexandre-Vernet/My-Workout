import { DEFAULT_VALUE_REST_TIME, RestTimeService } from './rest-time.service';
import { MuscleGroupEnum } from '../../interfaces/MuscleGroupEnum';

describe('RestTimeService', () => {
    let service: RestTimeService;

    beforeEach(() => {
        service = new RestTimeService();
        vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval', 'Date', 'performance'] });
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('starts at the default value', () => {
        expect(service.restTime()).toEqual(DEFAULT_VALUE_REST_TIME);
    });

    it('updates the rest time as the timer elapses', () => {
        service.startTimer();
        vi.advanceTimersByTime(1500);

        expect(service.restTime()).toEqual({ minutes: 0, seconds: 1, centiseconds: 50 });
    });

    it('resets to the default value when stopped', () => {
        service.startTimer();
        vi.advanceTimersByTime(1500);

        service.stopTimer();

        expect(service.restTime()).toEqual(DEFAULT_VALUE_REST_TIME);
    });

    it('saves and returns the rest time info for the resume banner', () => {
        expect(service.getRestTimeInfo()).toBeNull();

        service.saveRestTimeInfo({ muscleGroup: MuscleGroupEnum.BICEPS, tab: 2 });

        expect(service.getRestTimeInfo()).toEqual({ muscleGroup: MuscleGroupEnum.BICEPS, tab: 2 });
    });
});
