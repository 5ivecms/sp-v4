export const ApiEndpoints = {
  site: {
    findAll: () => '/site',
    create: () => '/site',
    delete: (id: number) => `/site/${id}`,
    findOne: (id: number) => `/site/${id}`,
    update: (id: number) => `/site/${id}`,
    clear: () => '/site/clear',
    deleteBulk: () => '/site/delete-bulk',
    search: () => '/site/search',
  },

  keywords: {
    findAll: () => '/keywords',
    create: () => '/keywords',
    createBulk: () => '/keywords/create-bulk',
    delete: (id: number) => `/keywords/${id}`,
    findOne: (id: number) => `/keywords/${id}`,
    update: (id: number) => `/keywords/${id}`,
    clear: () => '/keywords/clear',
    deleteBulk: () => '/keywords/delete-bulk',
    search: () => '/keywords/search',
    resetProcessStatus: () => '/keywords/reset-process-status',
    resetErrorStatus: () => '/keywords/reset-error-status',
    resetStatuses: () => '/keywords/reset-statuses',
  },
}
