import { IsArray, IsNotEmpty, IsNumber } from 'class-validator'

export class DeleteBulkSiteDto {
  @IsArray()
  @IsNotEmpty({ each: true })
  @IsNumber({}, { each: true })
  public readonly ids: number[]
}
