import { Box, Container } from '@mui/material'
import { Outlet } from 'react-router-dom'

import { Header } from '../../components/common'
import { styles } from './AdminLayout.styles'

const AdminLayout = () => {
  return (
    <Box sx={styles.main}>
      <Header />
      <Container sx={styles.container} maxWidth="xl">
        <Outlet />
      </Container>
    </Box>
  )
}

export default AdminLayout
