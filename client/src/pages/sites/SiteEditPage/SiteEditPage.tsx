import { Alert, Grid, Paper } from '@mui/material'
import { useParams } from 'react-router-dom'

import { PageHeader } from '../../../components/ui'
import { SiteApi } from '../../../core/redux/slices/site/api'
import { ANY } from '../../../core/types'
import { SiteEditForm } from './components'

const SiteEditPage = () => {
  const params = useParams()
  const { id } = params
  const { data, isLoading, isError, error } = SiteApi.useFindOneQuery(Number(id))

  if (isLoading) {
    return <>Загрузка</>
  }

  return (
    <>
      {isError && error && <Alert severity="error">{(error as ANY)?.data.message}</Alert>}
      {data && <PageHeader title={data.domain} showBackButton />}
      <Grid spacing={2} container>
        <Grid xs={6} item>
          <Paper sx={{ p: 3 }}>{data && <SiteEditForm site={data} />}</Paper>
        </Grid>
      </Grid>
    </>
  )
}

export default SiteEditPage
