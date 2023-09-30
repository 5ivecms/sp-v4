import { createBrowserRouter } from 'react-router-dom'

import { BrowseRoutes } from '../core/config/routes'
import { AdminLayout } from '../layouts'
import { KeywordsAddPage, KeywordsEditPage, KeywordsIndexPage, KeywordsViewPage } from '../pages/keywords'
import { SiteAddPage, SiteEditPage, SiteIndexPage, SiteViewPage } from '../pages/sites'

export const router = createBrowserRouter([
  {
    path: BrowseRoutes.admin.index(),
    element: <AdminLayout />,
    children: [
      {
        path: BrowseRoutes.admin.keywords.index(),
        children: [
          {
            path: BrowseRoutes.admin.keywords.index(),
            element: <KeywordsIndexPage />,
          },
          {
            path: BrowseRoutes.admin.keywords.add(),
            element: <KeywordsAddPage />,
          },
          {
            path: BrowseRoutes.admin.keywords.view(),
            element: <KeywordsViewPage />,
          },
          {
            path: BrowseRoutes.admin.keywords.edit(),
            element: <KeywordsEditPage />,
          },
        ],
      },
      {
        path: BrowseRoutes.admin.site.index(),
        children: [
          {
            path: BrowseRoutes.admin.site.index(),
            element: <SiteIndexPage />,
          },
          {
            path: BrowseRoutes.admin.site.add(),
            element: <SiteAddPage />,
          },
          {
            path: BrowseRoutes.admin.site.view(),
            element: <SiteViewPage />,
          },
          {
            path: BrowseRoutes.admin.site.edit(),
            element: <SiteEditPage />,
          },
        ],
      },
    ],
  },
])
