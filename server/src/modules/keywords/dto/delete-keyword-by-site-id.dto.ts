import { IsNumber } from 'class-validator'

export class DeleteKeywordBySiteId {
  @IsNumber()
  public readonly siteId: number
}
