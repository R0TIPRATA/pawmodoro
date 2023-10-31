//import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx'
import './index.css'
import { SeshProvider } from './context/SeshContext.tsx';
import { CssVarsProvider } from '@mui/joy';
import theme from './common/theme.ts';

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <BrowserRouter>
  <CssVarsProvider theme={theme}>
  <SeshProvider>
      <App />
    </SeshProvider>
  </CssVarsProvider>
  </BrowserRouter>
  // </React.StrictMode>,
)
