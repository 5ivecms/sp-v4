import { Box, Button, Chip, MenuItem, Stack, TextField } from '@mui/material'
import { createColumnHelper } from '@tanstack/react-table'
import { useSnackbar } from 'notistack'
import { ChangeEvent, useEffect, useMemo, useState } from 'react'

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
import { KeywordsApi } from '../../../core/redux/slices/keywords/api'
import { SiteApi } from '../../../core/redux/slices/site/api'
import { ANY } from '../../../core/types'
import { Keyword } from '../../../core/types/keyword'
import { Order, SearchQueryParams } from '../../../core/types/search'

type SiteAction = 'resetProcessStatus' | 'resetErrorStatus' | 'resetAllStatuses' | 'deleteKeywords' | 'noAction'

const siteActions: { label: string; value: SiteAction }[] = [
  { label: 'Не выбрано', value: 'noAction' },
  { label: 'Сбросить статус "В процессе"', value: 'resetProcessStatus' },
  { label: 'Сбросить статус "Ошибка"', value: 'resetErrorStatus' },
  { label: 'Удалить ключи', value: 'deleteKeywords' },
  { label: 'Сбросить статусы', value: 'resetAllStatuses' },
]

const columnHelper = createColumnHelper<Keyword>()

const columns = [
  columnHelper.accessor('id', {
    cell: (info) => info.getValue(),
    header: () => 'ID',
    minSize: 200,
    size: 200,
  }),
  columnHelper.accessor('keyword', {
    cell: (info) => info.getValue(),
    header: () => 'keyword',
    size: 2000,
  }),
  columnHelper.accessor('categoryId', {
    cell: (info) => info.getValue(),
    header: () => 'Категория',
    size: 2000,
  }),
  columnHelper.accessor('status', {
    cell: ({ row }) => {
      if (row.original.status === 'NEW') {
        return <Chip color="primary" label="Новый" size="small" />
      }
      if (row.original.status === 'COMPLETED') {
        return <Chip color="success" label="Завершен" size="small" />
      }
      if (row.original.status === 'PROCESS') {
        return <Chip color="warning" label="В процессе" size="small" />
      }
      if (row.original.status === 'ERROR') {
        return <Chip color="error" label="Ошибка" size="small" />
      }

      return <></>
    },
    header: () => 'Статус',
    size: 2000,
  }),
  columnHelper.accessor('site.domain', {
    cell: (info) => info.getValue(),
    header: () => 'Сайт',
    size: 2000,
  }),
]

const KeywordsIndexPage = () => {
  const { enqueueSnackbar } = useSnackbar()

  const siteQuery = SiteApi.useFindAllQuery()

  const filters: DataGridFilterDef<Keyword>[] = useMemo(
    () => [
      { name: 'id', placeholder: 'id', type: 'text' },
      { name: 'keyword', placeholder: 'keyword', type: 'text' },
      { name: 'categoryId', placeholder: 'Категория', type: 'text' },
      {
        name: 'status',
        placeholder: 'Статус',
        type: 'select',
        options: [
          { label: 'Все', value: '' },
          { label: 'Новый', value: 'NEW' },
          { label: 'В процессе', value: 'PROCESS' },
          { label: 'Завершен', value: 'COMPLETED' },
          { label: 'Ошибка', value: 'ERROR' },
        ],
      },
      {
        name: 'site.id',
        placeholder: 'Сайт',
        type: 'select',
        options: [
          { label: 'Все', value: '' },
          ...(siteQuery.data ?? []).map(({ domain, id }) => ({ label: domain, value: String(id) })),
        ],
      },
    ],
    [siteQuery.data]
  )
  const relations = getRelations(filters)

  const [selectedSite, setSelectedSite] = useState<number | string>('not-selected')
  const [siteAction, setSiteAction] = useState<SiteAction>('noAction')
  const [params, setParams] = useState<SearchQueryParams<Keyword>>({ relations })
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false)
  const [showResetProcessStatusBySiteDialog, setShowResetProcessStatusBySiteDialog] = useState<boolean>(false)
  const [showResetErrorStatusBySiteDialog, setShowResetErrorStatusBySiteDialog] = useState<boolean>(false)
  const [showDeleteKeywordsBySiteDialog, setShowDeleteKeywordsBySiteDialog] = useState<boolean>(false)
  const [showResetStatusesDialog, setShowResetStatusesDialog] = useState<boolean>(false)

  const keywordSearchQuery = KeywordsApi.useSearchQuery(params)
  const [deleteKeyword, keywordDeleteQuery] = KeywordsApi.useDeleteMutation()
  const [deleteBulkKeywords, keywordsDeleteBulkQuery] = KeywordsApi.useDeleteBulkMutation()
  const [clearKeywords, keywordsClearQuery] = KeywordsApi.useClearMutation()
  const [resetProcessStatus, resetProcessStatusQuery] = KeywordsApi.useResetProcessStatusMutation()
  const [resetErrorStatus, resetErrorStatusQuery] = KeywordsApi.useResetErrorStatusMutation()
  const [resetStatuses, resetStatusesQuery] = KeywordsApi.useResetStatusesMutation()

  const items = keywordSearchQuery.data?.items ?? []
  const tableIsLoading =
    keywordSearchQuery.isFetching ||
    keywordDeleteQuery.isLoading ||
    keywordsDeleteBulkQuery.isLoading ||
    keywordsClearQuery.isLoading ||
    siteQuery.isLoading ||
    siteQuery.isFetching ||
    resetProcessStatusQuery.isLoading ||
    resetErrorStatusQuery.isLoading ||
    resetStatusesQuery.isLoading

  const resetActions = () => {
    setSiteAction('noAction')
    setSelectedSite('not-selected')
  }

  const handleDelete = async (id: number) => {
    deleteKeyword(Number(id))
  }

  const handleDeleteMany = (ids: number[]) => {
    deleteBulkKeywords(ids.map(Number))
  }

  const handleDeleteAll = (): void => {
    setShowDeleteDialog(true)
  }

  const handleConfirmDeleteAll = (): void => {
    clearKeywords({})
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

  const onChangeOrderBy = (orderBy: keyof Keyword) => {
    setParams((prevParams) => ({ ...prevParams, orderBy }))
  }

  const onChangeFilter = (filter: Record<keyof Keyword, string>) => {
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

  const handleConfirmResetProcessStatusBySite = () => {
    if (selectedSite) {
      resetProcessStatus({ siteId: Number(selectedSite) })
      keywordSearchQuery.refetch()
    }
    setShowResetProcessStatusBySiteDialog(false)
    resetActions()
  }

  const handleConfirmResetErrorStatusBySite = () => {
    if (selectedSite) {
      resetErrorStatus({ siteId: Number(selectedSite) })
      keywordSearchQuery.refetch()
    }
    setShowResetErrorStatusBySiteDialog(false)
    resetActions()
  }

  const handleConfirmResetStatuses = () => {
    if (selectedSite) {
      resetStatuses({ siteId: Number(selectedSite) })
      keywordSearchQuery.refetch()
    }
    setShowResetStatusesDialog(false)
    resetActions()
  }

  const handleConfirmDeleteKeywordsBySite = () => {
    if (selectedSite) {
      clearKeywords({ siteId: Number(selectedSite) })
      keywordSearchQuery.refetch()
    }
    setShowDeleteKeywordsBySiteDialog(false)
    resetActions()
  }

  const handleChangeSite = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.target.value !== 'not-selected') {
      setSelectedSite(Number(e.target.value))
      return
    }
    setSelectedSite('not-selected')
  }

  const handleChangeSiteAction = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSiteAction(e.target.value as SiteAction)
  }

  const performSiteAction = () => {
    if (selectedSite === 'not-selected') {
      return
    }

    if (siteAction === 'resetProcessStatus') {
      setShowResetProcessStatusBySiteDialog(true)
      return
    }

    if (siteAction === 'resetErrorStatus') {
      setShowResetErrorStatusBySiteDialog(true)
      return
    }

    if (siteAction === 'deleteKeywords') {
      setShowDeleteKeywordsBySiteDialog(true)
      return
    }

    if (siteAction === 'resetAllStatuses') {
      setShowResetStatusesDialog(true)
    }
  }

  useEffect(() => {
    if (keywordsClearQuery.isSuccess) {
      enqueueSnackbar('Все keywords успешно удалены', {
        variant: 'success',
      })
      return
    }
    if (keywordsClearQuery.isError) {
      enqueueSnackbar((keywordsClearQuery.error as ANY).data.message, {
        variant: 'error',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keywordsClearQuery.isLoading])

  useEffect(() => {
    if (keywordDeleteQuery.isSuccess) {
      enqueueSnackbar('Keyword успешно удален', {
        variant: 'success',
      })
      return
    }
    if (keywordDeleteQuery.isError) {
      enqueueSnackbar((keywordDeleteQuery.error as ANY).data.message, {
        variant: 'error',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keywordDeleteQuery.isLoading])

  useEffect(() => {
    if (keywordsDeleteBulkQuery.isSuccess) {
      enqueueSnackbar('Keywords успешно удалены', {
        variant: 'success',
      })
      return
    }
    if (keywordsDeleteBulkQuery.isError) {
      enqueueSnackbar((keywordsDeleteBulkQuery.error as ANY).data.message, {
        variant: 'error',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keywordsDeleteBulkQuery.isLoading])

  const orderOptions: OrderOptions<Keyword> = {
    order: params?.order ?? 'asc',
    orderBy: params?.orderBy ?? 'id',
    onChangeOrder,
    onChangeOrderBy,
  }

  const paginationOptions: PaginationOptions = {
    limit: keywordSearchQuery.data?.take ?? 1,
    page: keywordSearchQuery.data?.page ?? 1,
    total: keywordSearchQuery.data?.total ?? 0,
    onChangePage,
  }

  const filterOptions: FilterOptions = {
    filter: {},
    onChangeFilter,
  }

  return (
    <>
      <PageHeader
        title="Keywords"
        actionButtons={{ addButton: { url: BrowseRoutes.admin.keywords.add() } }}
        buttons={
          <>
            <Button color="error" onClick={handleDeleteAll} variant="contained">
              Удалить все
            </Button>
          </>
        }
      />
      <Box sx={{ mb: 3 }}>
        <Stack direction="row" spacing={2}>
          <TextField
            sx={{ width: '250px' }}
            label="Сайт"
            value={selectedSite}
            name="siteId"
            onChange={handleChangeSite}
            select
            size="small"
          >
            <MenuItem key="not-selected" value="not-selected">
              Не выбрано
            </MenuItem>
            {(siteQuery?.data ?? []).map(({ domain, id }) => (
              <MenuItem key={`${domain}${id}`} value={id}>
                {domain}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            sx={{ width: '300px' }}
            label="Действие"
            value={siteAction}
            name="siteAction"
            onChange={handleChangeSiteAction}
            select
            size="small"
          >
            {siteActions.map(({ label, value }) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
          </TextField>
          <Button color="warning" variant="contained" onClick={performSiteAction}>
            Выполнить
          </Button>
        </Stack>
      </Box>
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
        text="Точно удалить все ключи?"
        title="Удалить все ключи"
      />

      <DeleteDialog
        onClose={() => setShowResetProcessStatusBySiteDialog(false)}
        onConfirm={handleConfirmResetProcessStatusBySite}
        open={showResetProcessStatusBySiteDialog}
        text="Точно сбросить статус ключей в процессе у выбранного сайта?"
        title="Сбросить статус в процессе"
      />

      <DeleteDialog
        onClose={() => setShowResetErrorStatusBySiteDialog(false)}
        onConfirm={handleConfirmResetErrorStatusBySite}
        open={showResetErrorStatusBySiteDialog}
        text="Точно сбросить статус ключей Ошибка у выбранного сайта?"
        title="Сбросить статус в Ошибка"
      />

      <DeleteDialog
        onClose={() => setShowDeleteKeywordsBySiteDialog(false)}
        onConfirm={handleConfirmDeleteKeywordsBySite}
        open={showDeleteKeywordsBySiteDialog}
        text="Точно удалить ключи выбранного сайта?"
        title="Удалить ключи выбранного сайта"
      />

      <DeleteDialog
        onClose={() => setShowResetStatusesDialog(false)}
        onConfirm={handleConfirmResetStatuses}
        open={showResetStatusesDialog}
        text="Точно сбросить статусы ключей у выбранного сайта?"
        title="Сбросить статусы выбранного сайта"
      />
    </>
  )
}

export default KeywordsIndexPage
