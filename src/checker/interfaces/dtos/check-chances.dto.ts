import {
    IsArray,
    IsBoolean,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString, Max, Min,
} from 'class-validator'
import {MAX_DICE_NUMBER, TWO} from "../../../shared/constants/dices.constant";

class Weapon {
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

    @IsNumber()
    numberMeleeOfAttacks: number

    @IsArray()
    weapons: Weapon[]

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
}

export class CheckChancesDto {
    @IsNotEmpty()
    attacker: Attacker

    @IsNotEmpty()
    defender: Defender
}
