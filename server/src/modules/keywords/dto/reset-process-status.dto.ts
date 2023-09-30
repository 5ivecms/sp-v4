import { IsNumber, IsOptional } from 'class-validator'

export class ResetProcessStatus {
  @IsNumber()
  @IsOptional()
  public readonly siteId?: number
}
