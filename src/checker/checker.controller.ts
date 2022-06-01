import {
    Body,
    Controller,
    InternalServerErrorException,
    Post,
} from '@nestjs/common'

import { CheckerService } from './checker.service'
import { CheckChancesDto } from './interfaces/dtos/check-chances.dto'
import { CheckChancesType } from './interfaces/types/check-chances.type'

@Controller('v1')
export class CheckerController {
    constructor(private readonly _checkerService: CheckerService) {}

    @Post('checkChances')
    async checkChances(
        @Body() checkChancesInput: CheckChancesDto,
    ): Promise<CheckChancesType> {
        try {
            return await this._checkerService.checkChances(checkChancesInput)
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }
}
