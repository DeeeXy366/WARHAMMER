import { BadRequestException } from '@nestjs/common'

import { Attacker } from '../../checker/interfaces/dtos/check-chances.dto'

export const fieldsChecker = async (
    attacker: Attacker,
    // defender: Defender,
): Promise<void> => {
    for await (const weapon of attacker.rangeWeapons) {
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
