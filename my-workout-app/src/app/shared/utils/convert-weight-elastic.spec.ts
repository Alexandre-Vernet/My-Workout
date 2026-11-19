import { convertWeightElastic } from './convert-weight-elastic';

describe('convertWeightElastic', () => {
    it('returns null when the weight is not a multiple of 5', () => {
        expect(convertWeightElastic(7)).toBeNull();
    });

    it('returns an empty combination for a weight of 0', () => {
        expect(convertWeightElastic(0)).toEqual([]);
    });

    it('finds a single elastic matching the exact weight', () => {
        const result = convertWeightElastic(5);
        expect(result).toEqual([{ name: 'Blanc', weight: 5, count: 1 }]);
    });

    it('finds the shortest combination for a weight requiring several elastics', () => {
        const result = convertWeightElastic(35);
        const total = result!.reduce((sum, elastic) => sum + elastic.weight, 0);
        expect(total).toBe(35);
    });

    it('groups identical elastics used twice under a single "2x" entry', () => {
        const result = convertWeightElastic(40);
        const noir2x = result!.find(e => e.name === '2x Noir');
        expect(noir2x).toBeTruthy();
        expect(result!.filter(e => e.name.includes('Noir')).length).toBe(1);
    });

    it('returns an empty combination when no combination can reach the requested weight', () => {
        // Max combined weight: 5+10+15+20*2+25*2 = 120
        expect(convertWeightElastic(125)).toEqual([]);
    });
});
