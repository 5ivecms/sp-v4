import { BrowseRoutes } from '../../../core/config/routes'
import type { HeaderMenuItem } from './header.interfaces'

export const headerMenu: HeaderMenuItem[] = [
  { title: 'Сайты', url: BrowseRoutes.admin.site.index() },
  { title: 'Keywords', url: BrowseRoutes.admin.keywords.index() },
]
