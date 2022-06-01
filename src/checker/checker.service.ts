import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import _ from 'lodash'

import {
    CHUNK_HUNDRED,
    CHUNK_ONE_HUNDRED_THOUSAND,
    HUNDRED,
    TWO,
} from '../shared/constants/dices.constant'
import { fieldsChecker } from '../shared/helpers/fields-checker.helper'
import { melee } from '../shared/helpers/melee.helper'
import { range } from '../shared/helpers/range.helper'

import { CheckChancesDto } from './interfaces/dtos/check-chances.dto'
import { CheckChancesType } from './interfaces/types/check-chances.type'

@Injectable()
export class CheckerService {
    constructor(private _configService: ConfigService) {}

    async checkChances(
        checkChancesInput: CheckChancesDto,
    ): Promise<CheckChancesType> {
        const { attacker, defender } = checkChancesInput
        const totalAverageRangeDamage = []
        const totalAverageMeleeDamage = []
        const rangeRes = {
            totalSuccessHits: 0,
            totalSuccessWounds: 0,
            totalHits: 0,
            totalWounds: 0,
        }
        const meleeRes = {
            totalSuccessHits: 0,
            totalSuccessWounds: 0,
            totalHits: 0,
            totalWounds: 0,
        }

        await fieldsChecker(attacker)

        const testArr = []
        for (let i = 1; i <= CHUNK_ONE_HUNDRED_THOUSAND; i += 1) {
            testArr.push(i)
        }

        const chunkTxs = _.chunk(testArr, CHUNK_HUNDRED)
        const processingData = Promise.all(
            chunkTxs.map(async (test) => {
                // eslint-disable-next-line no-unused-vars
                for await (const t of test) {
                    const rangeLocalRes = await range(attacker, defender)
                    rangeRes.totalHits += rangeLocalRes.hits
                    rangeRes.totalSuccessHits += rangeLocalRes.successHits
                    rangeRes.totalWounds += rangeLocalRes.wounds
                    rangeRes.totalSuccessWounds += rangeLocalRes.successWounds
                    totalAverageRangeDamage.push(rangeLocalRes.averageDamage)

                    const meleeLocalRes = await melee(attacker, defender)
                    meleeRes.totalHits += meleeLocalRes.hits
                    meleeRes.totalSuccessHits += meleeLocalRes.successHits
                    meleeRes.totalWounds += meleeLocalRes.wounds
                    meleeRes.totalSuccessWounds += meleeLocalRes.successWounds
                    totalAverageMeleeDamage.push(meleeLocalRes.averageDamage)
                }
            }),
        )
        await processingData

        return {
            range: {
                hits: `${(
                    (rangeRes.totalSuccessHits * HUNDRED) /
                    rangeRes.totalHits
                ).toFixed(0)}%`,
                wounds: `${(
                    (rangeRes.totalSuccessWounds * HUNDRED) /
                    rangeRes.totalWounds
                ).toFixed(0)}%`,
                averageDamage: (
                    totalAverageRangeDamage.reduce((a, b) => a + b) /
                    totalAverageRangeDamage.length
                ).toFixed(TWO),
            },
            melee: {
                hits: `${(
                    (meleeRes.totalSuccessHits * HUNDRED) /
                    meleeRes.totalHits
                ).toFixed(0)}%`,
                wounds: `${(
                    (meleeRes.totalSuccessWounds * HUNDRED) /
                    meleeRes.totalWounds
                ).toFixed(0)}%`,
                averageDamage: (
                    totalAverageMeleeDamage.reduce((a, b) => a + b) /
                    totalAverageMeleeDamage.length
                ).toFixed(TWO),
            },
        }
    }
}
