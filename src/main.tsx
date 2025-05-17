import React from 'react'
import ReactDOM from 'react-dom/client'
import { createTheme, MantineProvider } from '@mantine/core'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import '@mantine/core/styles.layer.css'

import App from './App'

const theme = createTheme({
  defaultRadius: 10
})

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false
    }
  }
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme}>
        <App />
      </MantineProvider>
    </QueryClientProvider>
  </React.StrictMode>
)
