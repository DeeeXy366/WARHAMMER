import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { CheckerModule } from './checker/checker.module'
import { config } from './config/config'

@Module({
    imports: [ConfigModule.forRoot(config), CheckerModule],
    providers: [],
})
export class AppModule {}
