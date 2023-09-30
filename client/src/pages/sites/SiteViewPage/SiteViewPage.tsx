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
import { SiteApi } from '../../../core/redux/slices/site/api'
import { ANY } from '../../../core/types'

const columns: InfoTableColumn[] = [
  { field: 'id', headerName: 'ID' },
  { field: 'domain', headerName: 'Домен' },
  { field: 'login', headerName: 'Логин' },
  { field: 'password', headerName: 'Пароль' },
]

const SiteViewPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()

  const siteFindOneQuery = SiteApi.useFindOneQuery(Number(id))
  const [deleteSite, siteDeleteQuery] = SiteApi.useDeleteMutation()

  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false)

  const handleDelete = (): void => {
    setShowDeleteDialog(true)
  }

  const confirmDeleteUseragent = async (): Promise<void> => {
    if (siteFindOneQuery.data?.id) {
      deleteSite(siteFindOneQuery.data.id)
    }
    setShowDeleteDialog(false)
  }

  useEffect(() => {
    if (siteDeleteQuery.isSuccess) {
      enqueueSnackbar('Сайт успешно удален', {
        variant: 'success',
      })
      navigate(BrowseRoutes.admin.site.index())
      return
    }

    if (siteDeleteQuery.isError) {
      enqueueSnackbar((siteDeleteQuery.error as ANY).data.message, {
        variant: 'error',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteDeleteQuery.isLoading])

  if (siteFindOneQuery.data) {
    return (
      <>
        <PageHeader
          title={siteFindOneQuery.data.domain}
          showBackButton
          buttons={
            <>
              <Button component={Link} endIcon={<Edit />} to={BrowseRoutes.admin.site.edit(id)} variant="contained">
                Редактировать
              </Button>
              <Button color="error" endIcon={<Delete />} onClick={handleDelete} variant="contained">
                Удалить
              </Button>
            </>
          }
        />
        <InfoTable columns={columns} data={siteFindOneQuery.data} thWidth={200} />
        <DeleteDialog
          onClose={() => setShowDeleteDialog(false)}
          onConfirm={confirmDeleteUseragent}
          open={showDeleteDialog}
          text="Точно удалить домен?"
          title="Удалить домен"
        />
      </>
    )
  }
  return <>Загрузка</>
}

export default SiteViewPage
