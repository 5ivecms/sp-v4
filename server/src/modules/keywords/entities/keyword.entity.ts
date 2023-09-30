import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { Site } from '../../../modules/site/entities/site.entity'
import { KeywordStatus } from '../types'

@Entity('keyword')
export class Keyword {
  @PrimaryGeneratedColumn()
  public id: number

  @Column({ type: 'varchar', nullable: false })
  public keyword: string

  @Column({ type: 'varchar', nullable: false, default: KeywordStatus.NEW })
  public status: KeywordStatus

  @Column({ type: 'varchar', nullable: true, default: '' })
  public error: string

  @Column({ type: 'int', nullable: true })
  public categoryId: number

  @Column({ type: 'int', nullable: true })
  public siteId: number

  @ManyToOne(() => Site)
  @JoinColumn()
  public site: Site
}
