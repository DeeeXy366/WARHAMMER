import { DamageStatType } from './damage-stat.type'

export class WeaponResult {
    weaponSuccessHits: number

    weaponSuccessWounds: number
}

export class ToWoundCheckerType {
    result: DamageStatType

    weaponResult: WeaponResult
}
