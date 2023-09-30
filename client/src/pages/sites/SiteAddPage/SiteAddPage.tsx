import { Grid, Paper } from '@mui/material'

import { PageHeader } from '../../../components/ui'
import { SiteForm } from './components'

const SiteAddPage = () => {
  return (
    <>
      <PageHeader title="Добавить сайт" showBackButton />
      <Grid spacing={2} container>
        <Grid xs={4} item>
          <Paper sx={{ p: 3 }}>
            <SiteForm />
          </Paper>
        </Grid>
      </Grid>
    </>
  )
}

export default SiteAddPage
