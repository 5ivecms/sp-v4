import axios from 'axios'

import { ANY } from '../types'

export const WordpressService = {
  getCategories: async (host: string) => {
    return axios.get<ANY[]>(`${host}/wp-json/wp/v2/categories?per_page=100`)
  },
}
