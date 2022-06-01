import { random } from 'lodash'

import {
    Attacker,
    MeleeWeapon,
    RangeWeapon,
} from '../../checker/interfaces/dtos/check-chances.dto'
import { MAX_DICE_NUMBER } from '../constants/dices.constant'
import { DamageStatType } from '../types/damage-stat.type'
import { ToWHCheckerType, WeaponResult } from '../types/to-w-h-checker.type'

export const toHitChecker = async (
    res: DamageStatType,
    weapon: MeleeWeapon | RangeWeapon,
    weaponRes: WeaponResult,
    attacker: Attacker,
    type: string,
): Promise<ToWHCheckerType> => {
    const result = res
    const weaponResult = weaponRes

    for (let h = 0; h < weapon.numberOfAttacks; h += 1) {
        let diceNumber = random(1, MAX_DICE_NUMBER)

        result.hits += 1

        if (
            weapon?.numberOfAutomaticallyWoundsOnHit &&
            diceNumber >= weapon?.numberOfAutomaticallyWoundsOnHit
        ) {
            weaponResult.weaponSuccessWounds += 1
            result.successHits += 1
        } else if (diceNumber >= attacker[type]) {
            weaponResult.weaponSuccessHits += 1
            result.successHits += 1
        } else if (diceNumber === 1 && attacker?.rerolsToHitOfOne) {
            diceNumber = random(1, MAX_DICE_NUMBER)

            if (
                weapon?.numberOfAutomaticallyWoundsOnHit &&
                diceNumber >= weapon?.numberOfAutomaticallyWoundsOnHit
            ) {
                weaponResult.weaponSuccessWounds += 1
                result.successHits += 1
            } else if (diceNumber >= attacker[type]) {
                weaponResult.weaponSuccessHits += 1
                result.successHits += 1
            }
        }
    }

    return {
        result,
        weaponResult,
    }
}
