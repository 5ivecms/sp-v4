import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class CreateSiteDto {
  @ApiProperty({ description: 'Домен', nullable: false, example: 'yandex.ru', type: String })
  @IsString()
  public domain: string

  @ApiProperty({ description: 'Логин', nullable: false, example: 'admin', type: String })
  @IsString()
  public login: string

  @ApiProperty({ description: 'Пароль', nullable: false, example: '123123', type: String })
  @IsString()
  public password: string
}
