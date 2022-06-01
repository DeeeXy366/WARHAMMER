import { BadRequestException } from '@nestjs/common'
import {random} from 'lodash'

import {
    Attacker,
    Defender,
} from '../../checker/interfaces/dtos/check-chances.dto'
import {
    FIVE,
    FOUR,
    HALF_ONE,
    MAX_DICE_NUMBER,
    ONE,
    THREE,
    TWO,
} from '../constants/dices.constant'
import { DamageStatType } from '../types/damage-stat.type'

const fieldsChecker = async (
    attacker: Attacker,
    // defender: Defender,
): Promise<void> => {
    for await (const weapon of attacker.weapons) {
        if (
            weapon?.inflictsMortalWoundsOn ||
            weapon?.mortalWoundsForOne ||
            weapon?.inAdditional
        ) {
            if (
                !weapon?.inflictsMortalWoundsOn ||
                !weapon?.mortalWoundsForOne ||
                !weapon?.inAdditional
            ) {
                throw new BadRequestException({
                    message: 'MORTALS_ERR',
                    description:
                        'If your weapon have mortal wounds, you need to send 3 fields (inflictsMortalWoundsOn, mortalWoundsForOne, inAdditional) together',
                })
            }
        }
    }
}

const paramChecker = async (
    param: number,
    max = MAX_DICE_NUMBER,
    min = TWO,
): Promise<number> => {
    let defenderSv = param

    if (defenderSv > max) {
        defenderSv = max
    } else if (defenderSv < min) {
        defenderSv = min
    }

    return defenderSv
}

const toWoundChecker = async (
    weaponS: number,
    defenderT: number,
    plusToWound = 0
): Promise<number> => {
    let toWound = 2
    const k = weaponS / defenderT

    if (k >= TWO) {
        toWound = TWO
    }
    if (ONE < k && k < TWO) {
        toWound = THREE
    }
    if (k === 1) {
        toWound = FOUR
    }
    if (HALF_ONE < k && k < 1) {
        toWound = FIVE
    }
    if (k <= HALF_ONE) {
        toWound = MAX_DICE_NUMBER
    }
    toWound = await paramChecker(toWound - plusToWound,)

    return toWound
}

export const range = async (
    attacker: Attacker,
    defender: Defender,
): Promise<DamageStatType> => {
    const result = {
        hits: 0,
        wounds: 0,
        successHits: 0,
        successWounds: 0,
        averageDamage: 0,
    }

    await fieldsChecker(attacker)

    for await (const weapon of attacker.weapons) {
        const weaponResult = {
            weaponSuccessHits: 0,
            weaponSuccessWounds: 0,
        }
        const numberToWound = await toWoundChecker(weapon.s, defender.t, attacker.plusToWound)

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
            } else if (diceNumber >= attacker.bs) {
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
                } else if (diceNumber >= attacker.bs) {
                    weaponResult.weaponSuccessHits += 1
                    result.successHits += 1
                }
            }
        }

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
                weaponResult.weaponSuccessWounds +=
                    weapon?.mortalWoundsForOne
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
    }

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
