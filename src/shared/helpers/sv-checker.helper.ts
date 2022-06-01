import { random } from 'lodash'

import {
    MeleeWeapon,
    RangeWeapon,
} from '../../checker/interfaces/dtos/check-chances.dto'
import { MAX_DICE_NUMBER, TWO } from '../constants/dices.constant'
import { DamageStatType } from '../types/damage-stat.type'
import { WeaponResult } from '../types/to-w-h-checker.type'

export const svChecker = async (
    res: DamageStatType,
    weapon: MeleeWeapon | RangeWeapon,
    weaponResult: WeaponResult,
    defenderSv: number,
): Promise<DamageStatType> => {
    const result = res

    for (let d = 0; d < weaponResult.weaponSuccessWounds; d += 1) {
        const diceNumberSv = random(1, MAX_DICE_NUMBER)
        let damage = 1

        switch (weapon.d) {
            case 'D3':
                damage = Math.ceil(random(1, MAX_DICE_NUMBER) / TWO)
                break
            case 'D6':
                damage = random(1, MAX_DICE_NUMBER)
                break
            default:
                damage = Number(weapon.d)
                break
        }

        if (diceNumberSv < defenderSv) {
            result.averageDamage += damage
        }
    }

    return result
}
