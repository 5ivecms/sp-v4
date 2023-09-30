import { Type } from 'class-transformer'
import { IsArray, ValidateNested } from 'class-validator'

import { CreateKeywordDto } from './create-keyword.dto'

export class CreateBulkKeywordDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateKeywordDto)
  public readonly keywords: CreateKeywordDto[]
}
