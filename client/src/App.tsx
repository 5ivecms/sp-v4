import { CssBaseline } from '@mui/material'
import { SnackbarProvider } from 'notistack'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router-dom'

import { store } from './core/redux/store'
import { router } from './routes/router'

const App = () => {
  return (
    <>
      <Provider store={store}>
        <SnackbarProvider
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          autoHideDuration={2000}
          maxSnack={5}
        >
          <CssBaseline />
          <RouterProvider router={router} />
        </SnackbarProvider>
      </Provider>
    </>
  )
}

export default App
