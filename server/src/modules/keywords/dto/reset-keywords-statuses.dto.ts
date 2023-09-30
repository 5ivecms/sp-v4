import { IsNumber, IsOptional } from 'class-validator'

export class ResetKeywordsStatusesDto {
  @IsNumber()
  @IsOptional()
  public readonly siteId?: number
}
