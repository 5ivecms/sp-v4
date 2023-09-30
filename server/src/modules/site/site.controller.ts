import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { SearchDto } from '../../common/services/search-service/search.dto'
import { CreateSiteDto, DeleteBulkSiteDto, UpdateSiteDto } from './dto'
import { Site } from './entities/site.entity'
import { SiteService } from './site.service'

@ApiTags('Сайт')
@Controller('site')
export class SiteController {
  constructor(private readonly siteService: SiteService) {}

  @Post()
  @ApiOperation({ summary: 'Добавить сайт' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: Site })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
  public create(@Body() createSiteDto: CreateSiteDto) {
    return this.siteService.create(createSiteDto)
  }

  @Get()
  @ApiOperation({ summary: 'Список сайтов' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: Site, isArray: true })
  public findAll() {
    return this.siteService.findAll()
  }

  @Get('search')
  public search(@Query() dto: SearchDto<Site>) {
    return this.siteService.search(dto)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить сайт' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: Site })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found' })
  public findOne(@Param('id') id: string) {
    return this.siteService.findOne(+id)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить сайт' })
  public update(@Param('id') id: string, @Body() updateSiteDto: UpdateSiteDto) {
    return this.siteService.update(+id, updateSiteDto)
  }

  @Delete('delete-bulk')
  public deleteBulk(@Body() dto: DeleteBulkSiteDto) {
    return this.siteService.bulkRemove(dto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить сайт' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: Site })
  public remove(@Param('id') id: string) {
    return this.siteService.remove(+id)
  }
}
