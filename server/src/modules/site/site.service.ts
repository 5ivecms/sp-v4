import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { SearchService } from 'src/common/services/search-service/search.service'
import { DeleteResult, Repository, UpdateResult } from 'typeorm'

import { DeleteBulkSiteDto } from './dto'
import { CreateSiteDto } from './dto/create-site.dto'
import { UpdateSiteDto } from './dto/update-site.dto'
import { Site } from './entities/site.entity'

@Injectable()
export class SiteService extends SearchService<Site> {
  constructor(@InjectRepository(Site) private readonly siteRepository: Repository<Site>) {
    super(siteRepository)
  }

  public create(createSiteDto: CreateSiteDto): Promise<Site> {
    return this.siteRepository.save(createSiteDto)
  }

  public findAll(): Promise<Site[]> {
    return this.siteRepository.find()
  }

  public async findOne(id: number): Promise<Site> {
    const site = await this.siteRepository.findOneBy({ id })

    if (!site) {
      throw new NotFoundException('Site not found')
    }

    return site
  }

  public async update(id: number, updateSiteDto: UpdateSiteDto): Promise<UpdateResult> {
    await this.findOne(id)
    return await this.siteRepository.update(id, updateSiteDto)
  }

  public remove(id: number): Promise<DeleteResult> {
    return this.siteRepository.delete(id)
  }

  public async bulkRemove(dto: DeleteBulkSiteDto) {
    const { ids } = dto
    try {
      const deleteResult = await this.siteRepository.delete(ids)

      return deleteResult
    } catch (e) {
      throw new InternalServerErrorException(e)
    }
  }
}
