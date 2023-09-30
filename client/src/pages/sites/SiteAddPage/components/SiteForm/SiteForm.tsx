import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Button, Grid } from '@mui/material'
import { useSnackbar } from 'notistack'
import React, { useEffect } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { object, string } from 'zod'

import { FormInput } from '../../../../../components/forms'
import { BrowseRoutes } from '../../../../../core/config/routes'
import { SiteApi } from '../../../../../core/redux/slices/site/api'
import { getErrorMessage } from '../../../../../core/utils/errors'

type CreateSiteFields = {
  domain: string
  login: string
  password: string
}

const createDomainSchema = object({
  domain: string().nonempty('Поле не может быть пустым'),
  login: string().nonempty('Поле не может быть пустым'),
  password: string().nonempty('Поле не может быть пустым'),
})

const SiteForm = () => {
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const [createDomain, { isLoading, isError, error, isSuccess }] = SiteApi.useCreateMutation()
  const methods = useForm<CreateSiteFields>({ mode: 'onChange', resolver: zodResolver(createDomainSchema) })

  const { handleSubmit } = methods

  const onSubmitHandler: SubmitHandler<CreateSiteFields> = (data) => {
    createDomain(data)
  }

  useEffect(() => {
    if (isSuccess) {
      enqueueSnackbar('Домен добавлен', {
        variant: 'success',
      })
      navigate(BrowseRoutes.admin.site.index())
      return
    }

    if (isError) {
      enqueueSnackbar(getErrorMessage(error), {
        variant: 'error',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading])

  return (
    <FormProvider {...methods}>
      <Box autoComplete="off" component="form" onSubmit={handleSubmit(onSubmitHandler)} noValidate>
        <FormInput
          variant="outlined"
          placeholder="Домен"
          label="Домен"
          name="domain"
          type="text"
          disabled={isLoading}
        />
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <FormInput
              variant="outlined"
              placeholder="Логин"
              label="Логин"
              name="login"
              type="text"
              disabled={isLoading}
            />
          </Grid>
          <Grid item xs={6}>
            <FormInput
              variant="outlined"
              placeholder="Пароль"
              label="Пароль"
              name="password"
              type="text"
              disabled={isLoading}
            />
          </Grid>
        </Grid>
        <Button disabled={isLoading} type="submit" variant="contained">
          Добавить
        </Button>
      </Box>
    </FormProvider>
  )
}

export default SiteForm
