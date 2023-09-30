import { Add } from '@mui/icons-material'
import { Button } from '@mui/material'
import { FC } from 'react'
import { Link } from 'react-router-dom'

import { ActionButton } from '../../types'

const AddButton: FC<ActionButton> = ({ label = 'Добавить', onClick, url }) => {
  if (url !== undefined) {
    return (
      <Button component={Link} endIcon={<Add />} to={url} variant="contained">
        {label}
      </Button>
    )
  }

  return (
    <Button endIcon={<Add />} onClick={onClick} variant="contained">
      {label}
    </Button>
  )
}

export default AddButton
