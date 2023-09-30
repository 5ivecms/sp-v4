import { Grid, Paper } from '@mui/material'

import { PageHeader } from '../../../components/ui'
import { KeywordForm } from './components'

const KeywordsAddPage = () => {
  return (
    <>
      <PageHeader title="Добавить keywords" showBackButton />
      <Grid spacing={2} container>
        <Grid xs={4} item>
          <Paper sx={{ p: 3 }}>
            <KeywordForm />
          </Paper>
        </Grid>
      </Grid>
    </>
  )
}

export default KeywordsAddPage
