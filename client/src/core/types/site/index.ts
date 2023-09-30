export type Site = {
  id: number
  domain: string
  login: string
  password: string
}

export type CreateSiteDto = {
  domain: string
  login: string
  password: string
}

export type UpdateSiteDto = Partial<CreateSiteDto>
