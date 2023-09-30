import { createApi } from '@reduxjs/toolkit/query/react'

import { ApiEndpoints } from '../../../api/api.endpoints'
import { DeleteResponse, FindAllResponse, UpdateResponse } from '../../../types'
import { CreateBulkKeywordDto, CreateKeywordDto, Keyword, UpdateKeywordDto } from '../../../types/keyword'
import { SearchQueryParams } from '../../../types/search'
import { baseQueryWithRefreshToken } from '../../baseQuery'

export const KeywordsApi = createApi({
  reducerPath: 'KeywordsApi',
  baseQuery: baseQueryWithRefreshToken,
  tagTypes: ['Keywords'],
  endpoints: (builder) => ({
    findOne: builder.query<Keyword, number>({
      query(id) {
        return {
          url: ApiEndpoints.keywords.findOne(id),
          method: 'GET',
        }
      },
      providesTags: (_result, _error, id) => [{ type: 'Keywords', id }],
    }),
    search: builder.query<FindAllResponse<Keyword>, SearchQueryParams<Keyword>>({
      query(params) {
        return {
          params,
          url: ApiEndpoints.keywords.search(),
          method: 'GET',
        }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({
                type: 'Keywords' as const,
                id,
              })),
              { type: 'Keywords', id: 'LIST' },
            ]
          : [{ type: 'Keywords', id: 'LIST' }],
    }),
    clear: builder.mutation<DeleteResponse, { siteId?: number }>({
      query(siteId) {
        return {
          url: ApiEndpoints.keywords.clear(),
          method: 'DELETE',
          body: siteId,
        }
      },
      invalidatesTags: ['Keywords'],
    }),
    create: builder.mutation<Keyword[], CreateKeywordDto>({
      query(data) {
        return {
          url: ApiEndpoints.keywords.create(),
          method: 'POST',
          body: data,
        }
      },
      invalidatesTags: [{ type: 'Keywords', id: 'LIST' }],
    }),

    createBulk: builder.mutation<Keyword[], CreateBulkKeywordDto>({
      query(data) {
        return {
          url: ApiEndpoints.keywords.createBulk(),
          method: 'POST',
          body: data,
        }
      },
      invalidatesTags: [{ type: 'Keywords', id: 'LIST' }],
    }),
    update: builder.mutation<UpdateResponse, { id: number; data: UpdateKeywordDto }>({
      query({ id, data }) {
        return {
          url: ApiEndpoints.keywords.update(id),
          method: 'PATCH',
          body: data,
        }
      },
      invalidatesTags: (result, _, { id }) =>
        result
          ? [
              { type: 'Keywords', id },
              { type: 'Keywords', id: 'LIST' },
            ]
          : [{ type: 'Keywords', id: 'LIST' }],
    }),
    delete: builder.mutation<DeleteResponse, number>({
      query(id) {
        return {
          url: ApiEndpoints.keywords.delete(id),
          method: 'DELETE',
        }
      },
      invalidatesTags: [{ type: 'Keywords', id: 'LIST' }],
    }),
    deleteBulk: builder.mutation<DeleteResponse, number[]>({
      query(ids) {
        return {
          url: ApiEndpoints.keywords.deleteBulk(),
          method: 'DELETE',
          body: { ids },
        }
      },
      invalidatesTags: (result, _, ids) =>
        result
          ? [
              ...ids.map((id) => ({
                type: 'Keywords' as const,
                id,
              })),
              { type: 'Keywords', id: 'LIST' },
            ]
          : [{ type: 'Keywords', id: 'LIST' }],
    }),
    resetProcessStatus: builder.mutation<DeleteResponse, { siteId?: number }>({
      query(siteId) {
        return {
          url: ApiEndpoints.keywords.resetProcessStatus(),
          method: 'POST',
          body: siteId,
        }
      },
      invalidatesTags: [{ type: 'Keywords', id: 'LIST' }],
    }),
    resetErrorStatus: builder.mutation<DeleteResponse, { siteId?: number }>({
      query(siteId) {
        return {
          url: ApiEndpoints.keywords.resetErrorStatus(),
          method: 'POST',
          body: siteId,
        }
      },
      invalidatesTags: [{ type: 'Keywords', id: 'LIST' }],
    }),
    resetStatuses: builder.mutation<void, { siteId?: number }>({
      query(siteId) {
        return {
          url: ApiEndpoints.keywords.resetStatuses(),
          method: 'POST',
          body: siteId,
        }
      },
      invalidatesTags: [{ type: 'Keywords', id: 'LIST' }],
    }),
  }),
})
