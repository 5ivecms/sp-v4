import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, DeleteResult, In, Repository, UpdateResult } from 'typeorm'

import { SearchService } from '../../common/services/search-service/search.service'
import {
  ClearKeywordsDto,
  CreateBulkKeywordDto,
  CreateKeywordDto,
  DeleteBulkKeywordDto,
  DeleteKeywordBySiteId,
  ResetErrorStatus,
  ResetKeywordsStatusesDto,
  ResetProcessStatus,
  SetCompletedStatusDto,
  UpdateKeywordDto,
} from './dto'
import { Keyword } from './entities/keyword.entity'
import { KeywordStatus } from './types'

@Injectable()
export class KeywordsService extends SearchService<Keyword> {
  constructor(
    @InjectRepository(Keyword) private readonly keywordsRepository: Repository<Keyword>,
    private readonly dataSource: DataSource
  ) {
    super(keywordsRepository)
  }

  public create(createKeywordDto: CreateKeywordDto): Promise<Keyword> {
    return this.keywordsRepository.save(createKeywordDto)
  }

  public async createBulk(createBulkKeywordDto: CreateBulkKeywordDto) {
    const { keywords } = createBulkKeywordDto
    return await Promise.all(
      keywords.map(async (keyword) => {
        return await this.keywordsRepository.save(keyword)
      })
    )
  }

  public findAll(): Promise<Keyword[]> {
    return this.keywordsRepository.find()
  }

  public async findOne(id: number): Promise<Keyword> {
    const keyword = await this.keywordsRepository.findOne({ where: { id }, relations: { site: true } })
    if (!keyword) {
      throw new NotFoundException('Keyword not fond')
    }

    return keyword
  }

  public update(id: number, updateKeywordDto: UpdateKeywordDto): Promise<UpdateResult> {
    return this.keywordsRepository.update(id, updateKeywordDto)
  }

  public remove(id: number): Promise<DeleteResult> {
    return this.keywordsRepository.delete(id)
  }

  public async clear(dto: ClearKeywordsDto) {
    const { siteId } = dto
    if (siteId) {
      const keywords = await this.keywordsRepository.find({ where: { siteId } })
      if (keywords.length) {
        return this.keywordsRepository.remove(keywords, { chunk: 1000 })
      }
      return
    }

    return this.keywordsRepository.clear()
  }

  public async bySite(siteId: number, take: number) {
    const result = await this.dataSource.manager.transaction(async (transactionEntityManager) => {
      const keywords = await transactionEntityManager.find(Keyword, {
        where: { status: KeywordStatus.NEW, siteId },
        order: { id: 'ASC' },
        take,
      })
      await transactionEntityManager.update(
        Keyword,
        { id: In(keywords.map(({ id }) => id)) },
        { status: KeywordStatus.PROCESS }
      )
      return keywords
    })
    return result
  }

  public setCompleted(id: number) {
    return this.keywordsRepository.update(id, { status: KeywordStatus.COMPLETED })
  }

  public setError(id: number) {
    return this.keywordsRepository.update(id, { status: KeywordStatus.ERROR })
  }

  public async setCompletedBulk(dto: SetCompletedStatusDto) {
    const { ids } = dto
    await this.keywordsRepository.update({ id: In(ids) }, { status: KeywordStatus.COMPLETED })
  }

  public async resetProcessStatus(dto: ResetProcessStatus) {
    const { siteId } = dto
    const keywords = await this.keywordsRepository.find({ where: { siteId, status: KeywordStatus.PROCESS } })
    return await Promise.all(
      keywords.map(async (keyword) => {
        return this.keywordsRepository.update(keyword.id, { status: KeywordStatus.NEW })
      })
    )
  }

  public async resetErrorStatus(dto: ResetErrorStatus) {
    const { siteId } = dto
    const keywords = await this.keywordsRepository.find({ where: { siteId, status: KeywordStatus.ERROR } })
    return await Promise.all(
      keywords.map(async (keyword) => {
        return this.keywordsRepository.update(keyword.id, { status: KeywordStatus.NEW })
      })
    )
  }

  public async resetStatuses(dto: ResetKeywordsStatusesDto) {
    const { siteId } = dto

    if (siteId) {
      const keywords = await this.keywordsRepository.find({ where: { siteId } })
      if (keywords.length) {
        return await Promise.all(
          keywords.map(async (keyword) => {
            return this.keywordsRepository.update(keyword.id, { status: KeywordStatus.NEW })
          })
        )
      }
      return
    }

    const keywords = await this.keywordsRepository.find()

    return await Promise.all(
      keywords.map(async (keyword) => {
        return this.keywordsRepository.update(keyword.id, { status: KeywordStatus.NEW })
      })
    )
  }

  public async deleteBySite(dto: DeleteKeywordBySiteId) {
    const { siteId } = dto
    const keywords = await this.keywordsRepository.find({ where: { siteId } })
    return await this.keywordsRepository.remove(keywords, { chunk: 1000 })
  }

  public async bulkRemove(dto: DeleteBulkKeywordDto) {
    const keywords = await this.keywordsRepository.find({ where: { id: In(dto.ids) } })
    return await this.keywordsRepository.remove(keywords, { chunk: 1000 })
  }
}
