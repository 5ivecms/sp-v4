import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import * as Joi from 'joi'
import { DataSource } from 'typeorm'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { dbConfig } from './config'
import serverConfig from './config/server.config'
import { DatabaseModule } from './modules/database/database.module'
import { KeywordsModule } from './modules/keywords/keywords.module'
import { SiteModule } from './modules/site/site.module'

const ENV = process.env.NODE_ENV ?? 'development'
// asd 123
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${ENV}`,
      load: [dbConfig, serverConfig],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'production').default('development'),
        PORT: Joi.number().default(5000),
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        JWT_ACCESS_SECRET: Joi.string().required(),
        JWT_REFRESH_SECRET: Joi.string().required(),
        JWT_ACCESS_EXPIRES_IN: Joi.string().required(),
        JWT_REFRESH_EXPIRES_IN: Joi.string().required(),
        BASE_USER_EMAIL: Joi.string().required(),
        BASE_USER_PASSWORD: Joi.string().required(),
      }),
    }),
    DatabaseModule,
    KeywordsModule,
    SiteModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
