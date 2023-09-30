import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Button } from '@mui/material'
import { useSnackbar } from 'notistack'
import { FC, useEffect } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { object, string } from 'zod'

import { FormInput } from '../../../../../components/forms'
import { BrowseRoutes } from '../../../../../core/config/routes'
import { SiteApi } from '../../../../../core/redux/slices/site/api'
import { ANY } from '../../../../../core/types'
import { Site } from '../../../../../core/types/site'

type EditSiteFields = {
  domain: string
  login: string
  password: string
}

type EditSiteFormProps = {
  site: Site
}

const editSiteSchema = object({
  domain: string().nonempty('Поле не может быть пустым'),
  login: string().nonempty('Поле не может быть пустым'),
  password: string().nonempty('Поле не может быть пустым'),
})

const SiteEditForm: FC<EditSiteFormProps> = ({ site }) => {
  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()

  const [updateSite, { isSuccess, isLoading, isError, error }] = SiteApi.useUpdateMutation()

  const methods = useForm<EditSiteFields>({
    defaultValues: site,
    mode: 'onChange',
    resolver: zodResolver(editSiteSchema),
  })

  const { handleSubmit } = methods

  const onSubmitHandler: SubmitHandler<EditSiteFields> = (data) => {
    updateSite({ id: site.id, data })
  }

  useEffect(() => {
    if (isSuccess) {
      enqueueSnackbar('Сайт успешно сохранен', {
        variant: 'success',
      })
      navigate(BrowseRoutes.admin.site.index())
      return
    }

    if (isError) {
      enqueueSnackbar((error as ANY).data.message, {
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
        <FormInput variant="outlined" placeholder="Логин" label="Логин" name="login" type="text" disabled={isLoading} />
        <FormInput
          variant="outlined"
          placeholder="Пароль"
          label="Пароль"
          name="password"
          type="text"
          disabled={isLoading}
        />
        <Button disabled={isLoading} type="submit" variant="contained">
          Сохранить
        </Button>
      </Box>
    </FormProvider>
  )
}

export default SiteEditForm
