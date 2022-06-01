import { random } from 'lodash'

import { Defender } from '../../checker/interfaces/dtos/check-chances.dto'
import { MAX_DICE_NUMBER } from '../constants/dices.constant'
import { DamageStatType } from '../types/damage-stat.type'

export const fnpChecker = async (
    res: DamageStatType,
    defender: Defender,
): Promise<DamageStatType> => {
    const result = res

    if (defender?.fnp) {
        for (let f = 0; f < result.averageDamage; f += 1) {
            const diceNumberFnp = random(1, MAX_DICE_NUMBER)

            if (diceNumberFnp >= defender.fnp) {
                result.averageDamage -= 1
            }
        }
    }

    return result
}
