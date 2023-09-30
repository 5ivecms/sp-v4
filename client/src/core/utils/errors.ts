import { ANY } from '../types'

export const getErrorMessage = (error: ANY) => {
  return error?.error || error?.message || error?.data?.message
}
