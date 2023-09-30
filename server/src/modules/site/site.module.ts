import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Site } from './entities/site.entity'
import { SiteController } from './site.controller'
import { SiteService } from './site.service'

@Module({
  imports: [TypeOrmModule.forFeature([Site])],
  controllers: [SiteController],
  providers: [SiteService],
})
export class SiteModule {}
