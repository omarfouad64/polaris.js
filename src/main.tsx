import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import './index.css'
import { router } from './routes.tsx'
import { GlobalProvider } from './globalContext.tsx'
import { Provider } from 'react-redux'
import { store } from './store'
import { resetDatabase } from './store/databaseSlice'

declare global {
  interface Window { resetPolarisDB: () => void; }
}

window.resetPolarisDB = () => {
  localStorage.removeItem('polaris_db');
  store.dispatch(resetDatabase());
  console.log('Database reset to factory defaults.');
  window.location.reload();
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <GlobalProvider>
        <RouterProvider router={router} />
      </GlobalProvider>
    </Provider>
  </StrictMode>
)

