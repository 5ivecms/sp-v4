import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Button } from '@mui/material'
import { useSnackbar } from 'notistack'
import { useCallback, useEffect, useState } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { object, string } from 'zod'

import { FormInput, FormSelect } from '../../../../../components/forms'
import { BrowseRoutes } from '../../../../../core/config/routes'
import { KeywordsApi } from '../../../../../core/redux/slices/keywords/api'
import { SiteApi } from '../../../../../core/redux/slices/site/api'
import { WordpressService } from '../../../../../core/services/wordpress'
import { ANY } from '../../../../../core/types'
import { CreateKeywordDto } from '../../../../../core/types/keyword'

type CreateKeywordsFields = {
  siteId: number
  categoryId: number
  list: string
}

const createDomainSchema = object({
  siteId: string().nonempty('Поле не может быть пустым'),
  categoryId: string().nonempty('Поле не может быть пустым'),
  list: string().nonempty('Поле не может быть пустым'),
})
const KeywordForm = () => {
  const [categories, setCategories] = useState<ANY[]>([])
  const [siteId, setSiteId] = useState<string>('')
  const sitesQuery = SiteApi.useFindAllQuery()

  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const [createKeywords, { isLoading, isError, error, isSuccess }] = KeywordsApi.useCreateBulkMutation()
  const methods = useForm<CreateKeywordsFields>({ mode: 'onChange', resolver: zodResolver(createDomainSchema) })

  const { handleSubmit, watch } = methods

  const onSubmitHandler: SubmitHandler<CreateKeywordsFields> = ({ list, categoryId, siteId }) => {
    const keywords: CreateKeywordDto[] = list
      .split('\n')
      .map((keyword) => ({ keyword, categoryId: Number(categoryId), siteId: Number(siteId) }))
    createKeywords({ keywords })
  }

  const fetchCategories = useCallback(async () => {
    try {
      const host = (sitesQuery.data ?? []).find((site) => site.id === Number(siteId))
      if (!host) {
        return
      }
      const response = await WordpressService.getCategories(host.domain)
      setCategories(response.data ?? [])
    } catch (e) {
      enqueueSnackbar('Ошибка при получении категорий', { variant: 'error' })
    }
  }, [enqueueSnackbar, siteId, sitesQuery.data])

  useEffect(() => {
    if (isSuccess) {
      enqueueSnackbar('Домен добавлен', {
        variant: 'success',
      })
      navigate(BrowseRoutes.admin.keywords.index())
      return
    }

    if (isError) {
      enqueueSnackbar((error as ANY).data.message, {
        variant: 'error',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories, watch])

  useEffect(() => {
    const subscription = watch((value) => {
      setSiteId(String(value.siteId))
    })
    return () => subscription.unsubscribe()
  }, [watch])

  return (
    <FormProvider {...methods}>
      <Box autoComplete="off" component="form" onSubmit={handleSubmit(onSubmitHandler)} noValidate>
        <FormSelect
          name="siteId"
          variant="outlined"
          label="Сайт"
          options={(sitesQuery.data ?? []).map(({ id, domain }) => ({ label: domain, value: String(id) }))}
          fullWidth
        />
        <FormSelect
          name="categoryId"
          variant="outlined"
          label="Категория"
          options={(categories ?? []).map(({ id, name }) => ({ label: name, value: String(id) }))}
          fullWidth
        />
        <FormInput
          variant="outlined"
          label="Список keywords"
          name="list"
          type="text"
          placeholder="Список keywords"
          rows={5}
          multiline
          disabled={isLoading}
        />
        <Button disabled={isLoading} type="submit" variant="contained">
          Добавить
        </Button>
      </Box>
    </FormProvider>
  )
}

export default KeywordForm
