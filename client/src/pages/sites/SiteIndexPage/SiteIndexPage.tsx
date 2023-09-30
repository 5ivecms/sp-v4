/* eslint-disable import/no-extraneous-dependencies */
import { createColumnHelper } from '@tanstack/react-table'
import { useSnackbar } from 'notistack'
import { useEffect, useState } from 'react'

import { DataGrid } from '../../../components/common/DataGrid'
import {
  DataGridFilterDef,
  FilterOptions,
  OrderOptions,
  PaginationOptions,
} from '../../../components/common/DataGrid/types'
import { getRelations } from '../../../components/common/DataGrid/utils'
import DeleteDialog from '../../../components/common/DeleteDialog/DeleteDialog'
import { PageHeader } from '../../../components/ui'
import { BrowseRoutes } from '../../../core/config/routes'
import { SiteApi } from '../../../core/redux/slices/site/api'
import { ANY } from '../../../core/types'
import { Order, SearchQueryParams } from '../../../core/types/search'
import { Site } from '../../../core/types/site'

const columnHelper = createColumnHelper<Site>()

const columns = [
  columnHelper.accessor('id', {
    cell: (info) => info.getValue(),
    header: () => 'ID',
    minSize: 200,
    size: 200,
  }),
  columnHelper.accessor('domain', {
    cell: (info) => info.getValue(),
    header: () => 'Домен',
    size: 2000,
  }),
  columnHelper.accessor('login', {
    cell: (info) => info.getValue(),
    header: () => 'Логин',
    size: 2000,
  }),
  columnHelper.accessor('password', {
    cell: (info) => info.getValue(),
    header: () => 'Пароль',
    size: 2000,
  }),
]

const filters: DataGridFilterDef<Site>[] = [
  { name: 'id', placeholder: 'id', type: 'text' },
  { name: 'domain', placeholder: 'Домен', type: 'text' },
  { name: 'login', placeholder: 'Логин', type: 'text' },
  { name: 'password', placeholder: 'Пароль', type: 'text' },
]

const SiteIndexPage = () => {
  const { enqueueSnackbar } = useSnackbar()
  const relations = getRelations(filters)

  const [params, setParams] = useState<SearchQueryParams<Site>>({ relations })
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false)

  const siteSearchQuery = SiteApi.useSearchQuery(params)
  const [siteDomain, siteDeleteQuery] = SiteApi.useDeleteMutation()
  const [siteBulkDomains, siteDeleteBulkQuery] = SiteApi.useDeleteBulkMutation()
  const [clearSites, sitesClearQuery] = SiteApi.useClearMutation()

  const items = siteSearchQuery.data?.items ?? []
  const tableIsLoading =
    siteSearchQuery.isFetching ||
    siteDeleteQuery.isLoading ||
    siteDeleteBulkQuery.isLoading ||
    sitesClearQuery.isLoading

  const handleDelete = async (id: number) => {
    siteDomain(Number(id))
  }

  const handleDeleteMany = (ids: number[]) => {
    siteBulkDomains(ids.map(Number))
  }

  const handleDeleteAll = (): void => {
    setShowDeleteDialog(true)
  }

  const handleConfirmDeleteAll = (): void => {
    clearSites()
    setShowDeleteDialog(false)
  }

  const onCloseDeleteDialog = () => {
    setShowDeleteDialog(false)
  }

  const onChangePage = (newPage: number): void => {
    setParams((prevParams) => ({ ...prevParams, page: newPage }))
  }

  const onChangeOrder = (order: Order) => {
    setParams((prevParams) => ({ ...prevParams, order }))
  }

  const onChangeOrderBy = (orderBy: keyof Site) => {
    setParams((prevParams) => ({ ...prevParams, orderBy }))
  }

  const onChangeFilter = (filter: Record<keyof Site, string>) => {
    setParams((prevParams) => {
      const { order, orderBy, page: prevPage, relations: prevRelations } = prevParams
      return {
        order,
        orderBy,
        page: prevPage,
        relations: prevRelations,
        ...filter,
      }
    })
  }

  useEffect(() => {
    if (sitesClearQuery.isSuccess) {
      enqueueSnackbar('Все сайты успешно удалены', {
        variant: 'success',
      })
      return
    }
    if (sitesClearQuery.isError) {
      enqueueSnackbar((sitesClearQuery.error as ANY).data.message, {
        variant: 'error',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sitesClearQuery.isLoading])

  useEffect(() => {
    if (siteDeleteQuery.isSuccess) {
      enqueueSnackbar('Домен успешно удален', {
        variant: 'success',
      })
      return
    }
    if (siteDeleteQuery.isError) {
      enqueueSnackbar((siteDeleteQuery.error as ANY).data.message, {
        variant: 'error',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteDeleteQuery.isLoading])

  useEffect(() => {
    if (siteDeleteBulkQuery.isSuccess) {
      enqueueSnackbar('Домены успешно удалены', {
        variant: 'success',
      })
      return
    }
    if (siteDeleteBulkQuery.isError) {
      enqueueSnackbar((siteDeleteBulkQuery.error as ANY).data.message, {
        variant: 'error',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteDeleteBulkQuery.isLoading])

  const orderOptions: OrderOptions<Site> = {
    order: params?.order ?? 'asc',
    orderBy: params?.orderBy ?? 'id',
    onChangeOrder,
    onChangeOrderBy,
  }

  const paginationOptions: PaginationOptions = {
    limit: siteSearchQuery.data?.take ?? 1,
    page: siteSearchQuery.data?.page ?? 1,
    total: siteSearchQuery.data?.total ?? 0,
    onChangePage,
  }

  const filterOptions: FilterOptions = {
    filter: {},
    onChangeFilter,
  }
  return (
    <>
      <PageHeader title="Сайты" actionButtons={{ addButton: { url: BrowseRoutes.admin.site.add() } }} />
      <DataGrid
        columns={columns}
        items={items}
        loading={tableIsLoading}
        onDelete={handleDelete}
        onDeleteMany={handleDeleteMany}
        paginationOptions={paginationOptions}
        filters={filters}
        orderOptions={orderOptions}
        filterOptions={filterOptions}
      />

      <DeleteDialog
        onClose={onCloseDeleteDialog}
        onConfirm={handleConfirmDeleteAll}
        open={showDeleteDialog}
        text="Точно удалить все домены?"
        title="Удалить все домены"
      />
    </>
  )
}

export default SiteIndexPage
