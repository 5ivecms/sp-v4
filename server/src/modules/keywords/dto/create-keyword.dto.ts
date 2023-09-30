import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsOptional, IsString } from 'class-validator'

export class CreateKeywordDto {
  @ApiProperty({ description: 'Keyword', nullable: false, example: 'смотреть фильм онлайн', type: String })
  @IsString()
  public readonly keyword: string

  @ApiProperty({ description: 'Id категории', nullable: false, example: 1, type: Number })
  @IsNumber()
  public readonly categoryId: number

  @ApiProperty({ description: 'Id сайта', nullable: false, example: 1, type: Number })
  @IsNumber()
  public readonly siteId: number

  @ApiProperty({ description: 'Ошибка', nullable: true, example: 'Timeout', type: String })
  @IsString()
  @IsOptional()
  public readonly error?: string
}
