import { random } from 'lodash'

import {
    Attacker,
    MeleeWeapon,
    RangeWeapon,
} from '../../checker/interfaces/dtos/check-chances.dto'
import { MAX_DICE_NUMBER } from '../constants/dices.constant'
import { DamageStatType } from '../types/damage-stat.type'
import {
    ToWoundCheckerType,
    WeaponResult,
} from '../types/to-wound-checker.type'

export const toWoundChecker = async (
    res: DamageStatType,
    weapon: MeleeWeapon | RangeWeapon,
    weaponRes: WeaponResult,
    attacker: Attacker,
    numberToWound: number,
): Promise<ToWoundCheckerType> => {
    const result = res
    const weaponResult = weaponRes

    for (let w = 0; w < weaponResult.weaponSuccessHits; w += 1) {
        let diceNumber = random(1, MAX_DICE_NUMBER)
        let inAdditional = true

        result.wounds += 1

        if (
            weapon?.inflictsMortalWoundsOn &&
            weapon?.mortalWoundsForOne &&
            weapon?.inAdditional &&
            diceNumber >= weapon?.inflictsMortalWoundsOn
        ) {
            inAdditional = weapon.inAdditional
            weaponResult.weaponSuccessWounds += weapon?.mortalWoundsForOne
            result.successWounds += 1
        }

        if (inAdditional) {
            if (
                weapon?.numberOfAutomaticallyWounds &&
                diceNumber >= weapon?.numberOfAutomaticallyWounds
            ) {
                weaponResult.weaponSuccessWounds += 1
                result.successWounds += 1
            } else if (diceNumber >= numberToWound) {
                weaponResult.weaponSuccessWounds += 1
                result.successWounds += 1
            } else if (diceNumber === 1 && attacker?.rerolsToWoundOfOne) {
                diceNumber = random(1, MAX_DICE_NUMBER)

                if (
                    weapon?.numberOfAutomaticallyWounds &&
                    diceNumber >= weapon?.numberOfAutomaticallyWounds
                ) {
                    weaponResult.weaponSuccessWounds += 1
                    result.successWounds += 1
                } else if (diceNumber >= numberToWound) {
                    weaponResult.weaponSuccessWounds += 1
                    result.successWounds += 1
                }
            }
        }
    }

    return {
        result,
        weaponResult,
    }
}
