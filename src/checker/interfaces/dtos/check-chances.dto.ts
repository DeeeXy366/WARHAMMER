import {
    IsArray,
    IsBoolean,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    Max,
    Min,
} from 'class-validator'

import { MAX_DICE_NUMBER, TWO } from '../../../shared/constants/dices.constant'

export class MeleeWeapon {
    @IsString()
    @IsOptional()
    s?: string

    @IsNumber()
    ap: number

    @IsString()
    d: string

    @IsNumber()
    numberOfAttacks: number

    @IsNumber()
    @IsOptional()
    numberOfAutomaticallyWounds?: number

    @IsNumber()
    @IsOptional()
    numberOfAutomaticallyWoundsOnHit?: number

    @IsNumber()
    @IsOptional()
    inflictsMortalWoundsOn?: number

    @IsNumber()
    @IsOptional()
    mortalWoundsForOne?: number

    @IsBoolean()
    @IsOptional()
    inAdditional?: boolean
}

export class RangeWeapon {
    @IsNumber()
    s: number

    @IsNumber()
    ap: number

    @IsString()
    d: string

    @IsNumber()
    numberOfAttacks: number

    @IsNumber()
    @IsOptional()
    numberOfAutomaticallyWounds?: number

    @IsNumber()
    @IsOptional()
    numberOfAutomaticallyWoundsOnHit?: number

    @IsNumber()
    @IsOptional()
    inflictsMortalWoundsOn?: number

    @IsNumber()
    @IsOptional()
    mortalWoundsForOne?: number

    @IsBoolean()
    @IsOptional()
    inAdditional?: boolean
}

export class Attacker {
    @IsNumber()
    @Min(TWO)
    @Max(MAX_DICE_NUMBER)
    bs: number

    @IsNumber()
    @Min(TWO)
    @Max(MAX_DICE_NUMBER)
    ws: number

    @IsNumber()
    s: number

    @IsArray()
    rangeWeapons: RangeWeapon[]

    @IsArray()
    meleeWeapons: MeleeWeapon[]

    @IsBoolean()
    @IsOptional()
    rerolsToHitOfOne?: boolean

    @IsBoolean()
    @IsOptional()
    rerolsToWoundOfOne?: boolean

    @IsNumber()
    @IsOptional()
    plusToWound?: number
}

export class Defender {
    @IsNumber()
    t: number

    @IsNumber()
    @Min(TWO)
    @Max(MAX_DICE_NUMBER)
    sv: number

    @IsNumber()
    @IsOptional()
    @Min(TWO)
    @Max(MAX_DICE_NUMBER)
    inv?: number

    @IsNumber()
    @IsOptional()
    @Min(TWO)
    @Max(MAX_DICE_NUMBER)
    fnp?: number

    @IsNumber()
    @IsOptional()
    plusSv?: number

    @IsNumber()
    @IsOptional()
    minusS?: number
}

export class CheckChancesDto {
    @IsNotEmpty()
    attacker: Attacker

    @IsNotEmpty()
    defender: Defender
}
