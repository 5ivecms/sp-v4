import { IsNumber } from 'class-validator'

export class SetCompletedStatusDto {
  @IsNumber({}, { each: true })
  public ids: number[]
}
