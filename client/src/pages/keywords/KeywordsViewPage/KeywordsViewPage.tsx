import { Delete, Edit } from '@mui/icons-material'
import { Button } from '@mui/material'
import { useSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { InfoTable } from '../../../components/common'
import DeleteDialog from '../../../components/common/DeleteDialog/DeleteDialog'
import { InfoTableColumn } from '../../../components/common/InfoTable/info-table.interfaces'
import { PageHeader } from '../../../components/ui'
import { BrowseRoutes } from '../../../core/config/routes'
import { KeywordsApi } from '../../../core/redux/slices/keywords/api'
import { ANY } from '../../../core/types'

const columns: InfoTableColumn[] = [
  { field: 'id', headerName: 'ID' },
  { field: 'keyword', headerName: 'Keyword' },
  { field: 'siteId', headerName: 'Site Id' },
  { field: 'status', headerName: 'Статус' },
]

const KeywordsViewPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()

  const keywordsFindOneQuery = KeywordsApi.useFindOneQuery(Number(id))
  const [deleteKeyword, keywordDeleteQuery] = KeywordsApi.useDeleteMutation()

  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false)

  const handleDelete = (): void => {
    setShowDeleteDialog(true)
  }

  const confirmDeleteUseragent = async (): Promise<void> => {
    if (keywordsFindOneQuery.data?.id) {
      deleteKeyword(keywordsFindOneQuery.data.id)
    }
    setShowDeleteDialog(false)
  }

  useEffect(() => {
    if (keywordDeleteQuery.isSuccess) {
      enqueueSnackbar('Keyword успешно удален', {
        variant: 'success',
      })
      navigate(BrowseRoutes.admin.keywords.index())
      return
    }

    if (keywordDeleteQuery.isError) {
      enqueueSnackbar((keywordDeleteQuery.error as ANY).data.message, {
        variant: 'error',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keywordDeleteQuery.isLoading])

  if (keywordsFindOneQuery.data) {
    return (
      <>
        <PageHeader
          title={keywordsFindOneQuery.data.keyword}
          showBackButton
          buttons={
            <>
              <Button component={Link} endIcon={<Edit />} to={BrowseRoutes.admin.keywords.edit(id)} variant="contained">
                Редактировать
              </Button>
              <Button color="error" endIcon={<Delete />} onClick={handleDelete} variant="contained">
                Удалить
              </Button>
            </>
          }
        />
        <InfoTable columns={columns} data={keywordsFindOneQuery.data} thWidth={200} />
        <DeleteDialog
          onClose={() => setShowDeleteDialog(false)}
          onConfirm={confirmDeleteUseragent}
          open={showDeleteDialog}
          text="Точно удалить keyword?"
          title="Удалить keyword"
        />
      </>
    )
  }
  return <>Загрузка</>
}

export default KeywordsViewPage
