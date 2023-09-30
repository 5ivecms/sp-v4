import { createApi } from '@reduxjs/toolkit/query/react'

import { ApiEndpoints } from '../../../api/api.endpoints'
import { DeleteResponse, FindAllResponse, UpdateResponse } from '../../../types'
import { SearchQueryParams } from '../../../types/search'
import { CreateSiteDto, Site, UpdateSiteDto } from '../../../types/site'
import { baseQueryWithRefreshToken } from '../../baseQuery'

export const SiteApi = createApi({
  reducerPath: 'SiteApi',
  baseQuery: baseQueryWithRefreshToken,
  tagTypes: ['Sites'],
  endpoints: (builder) => ({
    findOne: builder.query<Site, number>({
      query(id) {
        return {
          url: ApiEndpoints.site.findOne(id),
          method: 'GET',
        }
      },
      providesTags: (_result, _error, id) => [{ type: 'Sites', id }],
    }),

    findAll: builder.query<Site[], void>({
      query() {
        return {
          url: ApiEndpoints.site.findAll(),
          method: 'GET',
        }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: 'Sites' as const,
                id,
              })),
              { type: 'Sites', id: 'LIST' },
            ]
          : [{ type: 'Sites', id: 'LIST' }],
    }),
    search: builder.query<FindAllResponse<Site>, SearchQueryParams<Site>>({
      query(params) {
        return {
          params,
          url: ApiEndpoints.site.search(),
          method: 'GET',
        }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({
                type: 'Sites' as const,
                id,
              })),
              { type: 'Sites', id: 'LIST' },
            ]
          : [{ type: 'Sites', id: 'LIST' }],
    }),
    clear: builder.mutation<DeleteResponse, void>({
      query() {
        return {
          url: ApiEndpoints.site.clear(),
          method: 'DELETE',
        }
      },
      invalidatesTags: ['Sites'],
    }),
    create: builder.mutation<Site[], CreateSiteDto>({
      query(data) {
        return {
          url: ApiEndpoints.site.create(),
          method: 'POST',
          body: data,
        }
      },
      invalidatesTags: [{ type: 'Sites', id: 'LIST' }],
    }),
    update: builder.mutation<UpdateResponse, { id: number; data: UpdateSiteDto }>({
      query({ id, data }) {
        return {
          url: ApiEndpoints.site.update(id),
          method: 'PATCH',
          body: data,
        }
      },
      invalidatesTags: (result, _, { id }) =>
        result
          ? [
              { type: 'Sites', id },
              { type: 'Sites', id: 'LIST' },
            ]
          : [{ type: 'Sites', id: 'LIST' }],
    }),
    delete: builder.mutation<DeleteResponse, number>({
      query(id) {
        return {
          url: ApiEndpoints.site.delete(id),
          method: 'DELETE',
        }
      },
      invalidatesTags: [{ type: 'Sites', id: 'LIST' }],
    }),
    deleteBulk: builder.mutation<DeleteResponse, number[]>({
      query(ids) {
        return {
          url: ApiEndpoints.site.deleteBulk(),
          method: 'DELETE',
          body: { ids },
        }
      },
      invalidatesTags: (result, _, ids) =>
        result
          ? [
              ...ids.map((id) => ({
                type: 'Sites' as const,
                id,
              })),
              { type: 'Sites', id: 'LIST' },
            ]
          : [{ type: 'Sites', id: 'LIST' }],
    }),
  }),
})
