export interface Elastic {
    name: string;
    weight: number;
    count: number;
}

export const elastics: Elastic[] = [
    { name: 'Blanc', weight: 5, count: 1 },
    { name: 'Vert', weight: 10, count: 1 },
    { name: 'Bleu foncé', weight: 15, count: 1 },
    { name: 'Noir', weight: 20, count: 2 },
    { name: 'Bleu clair', weight: 25, count: 2 }
];
