import { ArrowBackIosNewOutlined } from '@mui/icons-material'
import { Box, IconButton, Stack, Typography } from '@mui/material'
import React, { FC, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

import { AddButton } from './components'
import { styles } from './PageHeader.styles'
import { ActionButton } from './types'

type PageHeaderProps = {
  title: string
  showBackButton?: boolean
  actionButtons?: {
    addButton: ActionButton
  }
  buttons?: ReactNode
}

const PageHeader: FC<PageHeaderProps> = ({ title, actionButtons, buttons, showBackButton = false }) => {
  const navigate = useNavigate()

  const goBack = () => {
    navigate(-1)
  }

  return (
    <Box sx={styles.container}>
      <Box sx={styles.left}>
        {showBackButton && (
          <IconButton aria-label="back" color="info" onClick={goBack} size="medium" sx={styles.backIcon}>
            <ArrowBackIosNewOutlined />
          </IconButton>
        )}
        <Typography component="h1" variant="h4">
          {title}
        </Typography>
      </Box>
      <Stack spacing={2} direction="row">
        {buttons && buttons}
        {actionButtons?.addButton && <AddButton {...actionButtons.addButton} />}
      </Stack>
    </Box>
  )
}

export default PageHeader
