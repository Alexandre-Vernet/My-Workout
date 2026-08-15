export enum MechanicEnum {
    COMPOUND = 'COMPOUND',
    ISOLATION = 'ISOLATION',
}

export const MechanicLabels: Record<MechanicEnum, string> = {
    [MechanicEnum.COMPOUND]: 'Poly-articulaire',
    [MechanicEnum.ISOLATION]: 'Isolation',
};
