import { random } from 'lodash'

import {
    Attacker,
    Defender,
} from '../../checker/interfaces/dtos/check-chances.dto'
import { MAX_DICE_NUMBER, TWO } from '../constants/dices.constant'
import { DamageStatType } from '../types/damage-stat.type'

import { fnpChecker } from './fnp-checker.helper'
import { paramChecker } from './param-checker.helper'
import { svChecker } from './sv-checker.helper'
import { toWoundChecker } from './to-wound-checker.helper'
import { toWoundNumberChecker } from './to-wound-number-checker.helper'

export const melee = async (
    attacker: Attacker,
    defender: Defender,
): Promise<DamageStatType> => {
    let result = {
        hits: 0,
        wounds: 0,
        successHits: 0,
        successWounds: 0,
        averageDamage: 0,
    }

    for await (const weapon of attacker.meleeWeapons) {
        let weaponResult = {
            weaponSuccessHits: 0,
            weaponSuccessWounds: 0,
        }
        let weaponS = attacker.s

        if (weapon?.s) {
            switch (weapon.s) {
                case 'X2':
                    weaponS *= TWO
                    break
                default:
                    weaponS += Number(weapon.s)
                    break
            }
        }
        if (defender?.minusS) {
            weaponS -= defender.minusS
        }

        const numberToWound = await toWoundNumberChecker(
            weaponS,
            defender.t,
            attacker.plusToWound,
        )

        let defenderClearSv = defender?.plusSv
            ? defender.sv - defender.plusSv
            : defender.sv
        let weaponAp = weapon.ap

        if (defenderClearSv < TWO) {
            defenderClearSv = TWO
            if (weaponAp !== 0) {
                weaponAp -= defender.plusSv
            }
        }

        let defenderSv = await paramChecker(defenderClearSv + weaponAp)
        if (defender?.inv && defenderSv > defender?.inv) {
            defenderSv = defender.inv
        }

        for (let h = 0; h < weapon.numberOfAttacks; h += 1) {
            let diceNumber = random(1, MAX_DICE_NUMBER)

            result.hits += 1

            if (
                weapon?.numberOfAutomaticallyWoundsOnHit &&
                diceNumber >= weapon?.numberOfAutomaticallyWoundsOnHit
            ) {
                weaponResult.weaponSuccessWounds += 1
                result.successHits += 1
            } else if (diceNumber >= attacker.ws) {
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
                } else if (diceNumber >= attacker.ws) {
                    weaponResult.weaponSuccessHits += 1
                    result.successHits += 1
                }
            }
        }

        const { result: toWoundRes, weaponResult: toWoundWeaponRes } =
            await toWoundChecker(
                result,
                weapon,
                weaponResult,
                attacker,
                numberToWound,
            )
        result = toWoundRes
        weaponResult = toWoundWeaponRes

        result = await svChecker(result, weapon, weaponResult, defenderSv)
    }

    result = await fnpChecker(result, defender)

    return result
}
