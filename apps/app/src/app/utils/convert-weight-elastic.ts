import { Elastic, elastics } from '../../../../../libs/interfaces/elastic';

export const convertWeightElastic = (weight: number) => {
    // Check if the weight is a multiple of 5, since all elastics come in 5kg steps
    if (weight % 5 !== 0) {
        return null;
    }

    // Recursive backtracking function to find the optimal combination
    const backtrack = (
        remaining: number,            // Weight left to reach
        index: number,                // Current index in the elastics list
        current: Elastic[],            // Current combination of elastic colors
        available: number[],          // How many of each elastic is still available
        best: { result: Elastic[] }    // Best (shortest) combination found so far
    ) => {
        // If we've reached the exact target weight
        if (remaining === 0) {
            // If it's the first result OR it's better (fewer elastics), save it
            if (
                best.result.length === 0 ||
                current.length < best.result.length
            ) {
                best.result = [...current]; // Save a copy of the current combo
            }
            return;
        }

        // If we've tried all elastics, stop recursion
        if (index >= elastics.length) {
            return;
        }

        const currentElastic = elastics[index];


        // Try using 0 up to available[index] units of the current elastic
        for (let i = 0; i <= available[index]; i++) {
            const newRemaining = remaining - i * currentElastic.weight;

            // If weight goes below 0, no need to continue this path
            if (newRemaining < 0) {
                break;
            }

            // Add i elastics of this type to the current combination
            for (let j = 0; j < i; j++) {
                current.push({ ...currentElastic });
            }

            // Move to the next elastic type
            backtrack(newRemaining, index + 1, current, available, best);

            // Backtrack: remove the i elastics just added
            for (let j = 0; j < i; j++) {
                current.pop();
            }
        }
    };

    // Create the availability array from your elastics config
    const available = elastics.map(e => e.count);

    // Holder for the best solution (fewest elastics)
    const best = { result: [] as Elastic[] };

    // Start recursive search
    backtrack(weight, 0, [], available, best);

    // Remove duplicate color and add "2x" to the name
    const bestCombinaison = best.result;
    bestCombinaison.forEach((elastic, index) => {
        const duplicateIndex = bestCombinaison.findIndex((e, i) => e.name === elastic.name && i !== index);

        if (duplicateIndex !== -1) {
            // Group same elastics
            bestCombinaison[index].name = `2x ${ elastic.name }`;

            // Remove other color
            bestCombinaison.splice(duplicateIndex, 1);
        }
    });

    return bestCombinaison;
}
