import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import _ from 'lodash'

import {
    CHUNK_HUNDRED,
    CHUNK_ONE_HUNDRED_THOUSAND,
    HUNDRED,
    TWO,
} from '../shared/constants/dices.constant'
import { range } from '../shared/helpers/range.helper'

import { CheckChancesDto } from './interfaces/dtos/check-chances.dto'
import { CheckChancesType, Melee } from './interfaces/types/check-chances.type'

@Injectable()
export class CheckerService {
    constructor(private _configService: ConfigService) {}

    async checkChances(
        checkChancesInput: CheckChancesDto,
    ): Promise<CheckChancesType> {
        const { attacker, defender } = checkChancesInput
        const totalAverageDamage = []
        const testArr = []
        let totalSuccessHits = 0
        let totalSuccessWounds = 0
        let totalHits = 0
        let totalWounds = 0

        for (let i = 1; i <= CHUNK_ONE_HUNDRED_THOUSAND; i += 1) {
            testArr.push(i)
        }

        const chunkTxs = _.chunk(testArr, CHUNK_HUNDRED)
        const processingData = Promise.all(
            chunkTxs.map(async (test) => {
                // eslint-disable-next-line no-unused-vars
                for await (const t of test) {
                    const rangeRes = await range(attacker, defender)
                    totalHits += rangeRes.hits
                    totalSuccessHits += rangeRes.successHits
                    totalWounds += rangeRes.wounds
                    totalSuccessWounds += rangeRes.successWounds
                    totalAverageDamage.push(rangeRes.averageDamage)
                }
            }),
        )
        await processingData

        return {
            range: {
                hits: `${((totalSuccessHits * HUNDRED) / totalHits).toFixed(
                    0,
                )}%`,
                wounds: `${(
                    (totalSuccessWounds * HUNDRED) /
                    totalWounds
                ).toFixed(0)}%`,
                averageDamage: (
                    totalAverageDamage.reduce((a, b) => a + b) /
                    totalAverageDamage.length
                ).toFixed(TWO),
            },
            melee: {} as Melee,
        }
    }
}
