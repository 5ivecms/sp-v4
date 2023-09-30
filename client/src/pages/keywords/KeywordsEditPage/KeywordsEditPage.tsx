import { Alert, Grid, Paper } from '@mui/material'
import { useParams } from 'react-router-dom'

import { PageHeader } from '../../../components/ui'
import { KeywordsApi } from '../../../core/redux/slices/keywords/api'
import { ANY } from '../../../core/types'
import { KeywordEditForm } from './components'

const KeywordsEditPage = () => {
  const params = useParams()
  const { id } = params
  const { data, isLoading, isError, error } = KeywordsApi.useFindOneQuery(Number(id))

  if (isLoading) {
    return <>Загрузка</>
  }

  return (
    <>
      {isError && error && <Alert severity="error">{(error as ANY)?.data.message}</Alert>}
      {data && <PageHeader title={data.keyword} showBackButton />}
      <Grid spacing={2} container>
        <Grid xs={6} item>
          <Paper sx={{ p: 3 }}>{data && <KeywordEditForm keyword={data} />}</Paper>
        </Grid>
      </Grid>
    </>
  )
}

export default KeywordsEditPage
