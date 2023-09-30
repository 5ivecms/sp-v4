import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('site')
export class Site {
  @ApiProperty({ description: 'id', nullable: false, example: 1 })
  @PrimaryGeneratedColumn()
  public id: number

  @ApiProperty({ description: 'Домен', nullable: false, example: 'yandex.ru' })
  @Column({ type: 'varchar' })
  public domain: string

  @ApiProperty({ description: 'Логин', nullable: false, example: 'admin' })
  @Column({ type: 'varchar' })
  public login: string

  @ApiProperty({ description: 'Пароль', nullable: false, example: '123123' })
  @Column({ type: 'varchar' })
  public password: string
}
