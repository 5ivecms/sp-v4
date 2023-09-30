import { IsArray, IsNotEmpty, IsNumber } from 'class-validator'

export class DeleteBulkKeywordDto {
  @IsArray()
  @IsNotEmpty({ each: true })
  @IsNumber({}, { each: true })
  public readonly ids: number[]
}
