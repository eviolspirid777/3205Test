import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App.tsx'

import { ConfigProvider } from 'antd'
import locale from "antd/locale/ru_RU";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider locale={locale}>
      <App />
    </ConfigProvider>
  </StrictMode>,
)
