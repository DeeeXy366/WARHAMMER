import { MAX_DICE_NUMBER, TWO } from '../constants/dices.constant'

export const paramChecker = async (
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
