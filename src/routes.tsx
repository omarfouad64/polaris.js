import { createBrowserRouter } from 'react-router-dom'
import RootLayout from './Pages/RootLayout.tsx'
import Home from './Pages/Home/Home.tsx'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
        {
            path: '/',
            element: <Home />
        }
    ]
  },
])
