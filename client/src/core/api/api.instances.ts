import axios from 'axios'

import { API_URL } from '../config/api'
import { getContentType } from './api.helpers'

export const axiosPublic = axios.create({
  baseURL: API_URL,
  headers: getContentType(),
})
