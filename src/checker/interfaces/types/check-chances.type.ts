export class Range {
    hits: string

    wounds: string

    averageDamage: string
}

export class Melee {
    hits: string

    wounds: string

    averageDamage: string
}

export class CheckChancesType {
    range: Range

    melee: Melee
}
