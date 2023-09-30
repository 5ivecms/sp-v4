import { IsNumber, IsOptional } from 'class-validator'

export class ClearKeywordsDto {
  @IsNumber()
  @IsOptional()
  public readonly siteId?: number
}
