const ADMIN_PATH = '/admin'

export const BrowseRoutes = {
  home: () => '/',
  login: () => '/login',

  admin: {
    index: () => ADMIN_PATH,

    base: {
      home: () => `${ADMIN_PATH}/home`,
    },

    keywords: {
      index: () => `${ADMIN_PATH}/keywords`,
      add: () => `${ADMIN_PATH}/keywords/add`,
      view: (id: string | number = ':id') => `${ADMIN_PATH}/keywords/view/${id}`,
      edit: (id: string | number = ':id') => `${ADMIN_PATH}/keywords/edit/${id}`,
    },

    site: {
      index: () => `${ADMIN_PATH}/site`,
      add: () => `${ADMIN_PATH}/site/add`,
      view: (id: string | number = ':id') => `${ADMIN_PATH}/site/view/${id}`,
      edit: (id: string | number = ':id') => `${ADMIN_PATH}/site/edit/${id}`,
    },
  },
}
