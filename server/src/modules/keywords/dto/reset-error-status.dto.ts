import { IsNumber, IsOptional } from 'class-validator'

export class ResetErrorStatus {
  @IsNumber()
  @IsOptional()
  public readonly siteId?: number
}
