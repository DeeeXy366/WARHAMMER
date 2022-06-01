import {
    Attacker,
    Defender,
} from '../../checker/interfaces/dtos/check-chances.dto'
import { TWO } from '../constants/dices.constant'
import { DamageStatType } from '../types/damage-stat.type'

import { fnpChecker } from './fnp-checker.helper'
import { paramChecker } from './param-checker.helper'
import { svChecker } from './sv-checker.helper'
import { toHitChecker } from './to-hit-checker.helper'
import { toWoundChecker } from './to-wound-checker.helper'
import { toWoundNumberChecker } from './to-wound-number-checker.helper'

export const range = async (
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

    for await (const weapon of attacker.rangeWeapons) {
        const numberToWound = await toWoundNumberChecker(
            weapon.s,
            defender.t,
            attacker.plusToWound,
        )
        let weaponResult = {
            weaponSuccessHits: 0,
            weaponSuccessWounds: 0,
        }
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

        const { result: toHitRes, weaponResult: toHitWeaponRes } =
            await toHitChecker(result, weapon, weaponResult, attacker, 'bs')
        result = toHitRes
        weaponResult = toHitWeaponRes

        const { result: newRes, weaponResult: newWeaponRes } =
            await toWoundChecker(
                result,
                weapon,
                weaponResult,
                attacker,
                numberToWound,
            )
        result = newRes
        weaponResult = newWeaponRes

        result = await svChecker(result, weapon, weaponResult, defenderSv)
    }

    result = await fnpChecker(result, defender)

    return result
}
