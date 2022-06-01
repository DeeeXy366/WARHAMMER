import {
    FIVE,
    FOUR,
    HALF_ONE,
    MAX_DICE_NUMBER,
    ONE,
    THREE,
    TWO,
} from '../constants/dices.constant'

import { paramChecker } from './param-checker.helper'

export const toWoundNumberChecker = async (
    weaponS: number,
    defenderT: number,
    plusToWound = 0,
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
    toWound = await paramChecker(toWound - plusToWound)

    return toWound
}
