import { Site } from '../site'

export type Keyword = {
  id: number
  keyword: string
  categoryId: number
  siteId: number
  status: string
  site: Site
}

export type CreateKeywordDto = {
  keyword: string
  categoryId: number
  siteId: number
  status?: string
}

export type CreateBulkKeywordDto = {
  keywords: CreateKeywordDto[]
}

export type UpdateKeywordDto = Partial<CreateKeywordDto>
