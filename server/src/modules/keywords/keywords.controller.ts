import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { DeleteResult, UpdateResult } from 'typeorm'

import { SearchDto } from '../../common/services/search-service/search.dto'
import {
  ClearKeywordsDto,
  CreateBulkKeywordDto,
  DeleteBulkKeywordDto,
  DeleteKeywordBySiteId,
  ResetErrorStatus,
  ResetKeywordsStatusesDto,
  ResetProcessStatus,
  SetCompletedStatusDto,
} from './dto'
import { CreateKeywordDto } from './dto/create-keyword.dto'
import { UpdateKeywordDto } from './dto/update-keyword.dto'
import { Keyword } from './entities/keyword.entity'
import { KeywordsService } from './keywords.service'

@ApiTags('Keywords')
@Controller('keywords')
export class KeywordsController {
  constructor(private readonly keywordsService: KeywordsService) {}

  @Post()
  @ApiOperation({ summary: 'Добавить ключевую фразу' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: Keyword })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
  public create(@Body() createKeywordDto: CreateKeywordDto) {
    return this.keywordsService.create(createKeywordDto)
  }

  @Post('reset-statuses')
  public resetStatuses(@Body() dto: ResetKeywordsStatusesDto) {
    return this.keywordsService.resetStatuses(dto)
  }

  @Post('set-completed-bulk')
  public setCompletedBulk(@Body() dto: SetCompletedStatusDto) {
    return this.keywordsService.setCompletedBulk(dto)
  }

  @Post('create-bulk')
  public createBulk(@Body() createBulkDto: CreateBulkKeywordDto) {
    return this.keywordsService.createBulk(createBulkDto)
  }

  @Post('reset-process-status')
  public resetProcessStatus(@Body() dto: ResetProcessStatus) {
    return this.keywordsService.resetProcessStatus(dto)
  }

  @Post('reset-error-status')
  public resetErrorStatus(@Body() dto: ResetErrorStatus) {
    return this.keywordsService.resetErrorStatus(dto)
  }

  @Post(':id/set-completed')
  public setCompleted(@Param('id') id: number) {
    return this.keywordsService.setCompleted(Number(id))
  }

  @Post(':id/set-error')
  public setError(@Param('id') id: number) {
    return this.keywordsService.setError(Number(id))
  }

  @Get()
  @ApiOperation({ summary: 'Получить все ключевые фразы' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: Keyword, isArray: true })
  public findAll() {
    return this.keywordsService.findAll()
  }

  @Get('by-site/:siteId')
  public nextKeywords(@Param('siteId') siteId: number, @Query('limit') limit: number) {
    return this.keywordsService.bySite(Number(siteId), Number(limit))
  }

  @Get('search')
  public search(@Query() dto: SearchDto<Keyword>) {
    return this.keywordsService.search(dto)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить ключевую фразу по id' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: Keyword })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found' })
  public findOne(@Param('id') id: string) {
    return this.keywordsService.findOne(+id)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить ключевую фразу' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: UpdateResult })
  public update(@Param('id') id: string, @Body() updateKeywordDto: UpdateKeywordDto) {
    return this.keywordsService.update(+id, updateKeywordDto)
  }

  @Delete('delete-bulk')
  public deleteBulk(@Body() dto: DeleteBulkKeywordDto) {
    return this.keywordsService.bulkRemove(dto)
  }

  @Delete('by-site-id')
  public deleteBySiteId(@Body() dto: DeleteKeywordBySiteId) {
    return this.keywordsService.deleteBySite(dto)
  }

  @Delete('clear')
  public clear(@Body() dto: ClearKeywordsDto) {
    return this.keywordsService.clear(dto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить ключевую фразу' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: DeleteResult })
  public remove(@Param('id') id: string) {
    return this.keywordsService.remove(+id)
  }
}
