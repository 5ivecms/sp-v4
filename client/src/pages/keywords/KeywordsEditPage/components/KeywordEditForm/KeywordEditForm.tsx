import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Button } from '@mui/material'
import { useSnackbar } from 'notistack'
import { FC, useCallback, useEffect, useState } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { object, string } from 'zod'

import { FormInput, FormSelect } from '../../../../../components/forms'
import { BrowseRoutes } from '../../../../../core/config/routes'
import { KeywordsApi } from '../../../../../core/redux/slices/keywords/api'
import { SiteApi } from '../../../../../core/redux/slices/site/api'
import { WordpressService } from '../../../../../core/services/wordpress'
import { ANY } from '../../../../../core/types'
import { Keyword } from '../../../../../core/types/keyword'

type EditKeywordFields = {
  keyword: string
  siteId: string
  categoryId: string
  status: string
}

type EditKeywordFormProps = {
  keyword: Keyword
}

const editSiteSchema = object({
  keyword: string().nonempty('Поле не может быть пустым'),
  siteId: string().nonempty('Поле не может быть пустым'),
  categoryId: string().nonempty('Поле не может быть пустым'),
  status: string().nonempty('Поле не может быть пустым'),
})
const KeywordEditForm: FC<EditKeywordFormProps> = ({ keyword }) => {
  const [categories, setCategories] = useState<ANY[]>([])
  const [siteId, setSiteId] = useState<string>(String(keyword.siteId))

  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()

  const sitesQuery = SiteApi.useFindAllQuery()

  const [updateKeyword, { isSuccess, isLoading, isError, error }] = KeywordsApi.useUpdateMutation()

  const methods = useForm<EditKeywordFields>({
    defaultValues: {
      categoryId: String(keyword.categoryId),
      keyword: keyword.keyword,
      siteId: String(keyword.siteId),
      status: String(keyword.status),
    },
    mode: 'onChange',
    resolver: zodResolver(editSiteSchema),
  })

  const { handleSubmit, watch } = methods

  const onSubmitHandler: SubmitHandler<EditKeywordFields> = (data) => {
    updateKeyword({
      id: keyword.id,
      data: {
        categoryId: Number(data.categoryId),
        keyword: data.keyword,
        siteId: Number(data.siteId),
        status: data.status,
      },
    })
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
      enqueueSnackbar('Keyword успешно сохранен', {
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

  if (sitesQuery.isLoading || !categories.length) {
    return <>Загрузка</>
  }

  return (
    <FormProvider {...methods}>
      <Box autoComplete="off" component="form" onSubmit={handleSubmit(onSubmitHandler)} noValidate>
        <FormInput
          variant="outlined"
          placeholder="Keyword"
          label="Keyword"
          name="keyword"
          type="text"
          disabled={isLoading}
        />
        <FormSelect
          name="siteId"
          variant="outlined"
          label="Тип"
          options={(sitesQuery.data ?? []).map(({ domain, id }) => ({ label: domain, value: String(id) }))}
          defaultValue={keyword.siteId}
          fullWidth
        />
        <FormSelect
          name="categoryId"
          variant="outlined"
          label="Категория"
          options={(categories ?? []).map(({ id, name }) => ({ label: name, value: String(id) }))}
          fullWidth
        />
        <FormSelect
          name="status"
          variant="outlined"
          label="Статус"
          options={[
            { label: 'Новый', value: 'NEW' },
            { label: 'В процессе', value: 'PROCESS' },
            { label: 'Завершен', value: 'COMPLETED' },
            { label: 'Ошибка', value: 'ERROR' },
          ]}
          fullWidth
        />
        <Button disabled={isLoading} type="submit" variant="contained">
          Сохранить
        </Button>
      </Box>
    </FormProvider>
  )
}

export default KeywordEditForm
