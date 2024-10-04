import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css'
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";
import UserDashboard from '../src/Dashboard/UserDashboard.jsx'
import SignUp from './Authentication/SignUp.jsx';
import Login from './Authentication/Login.jsx'
import { UserContextProvider } from './Context/UserContextProvider.jsx';
import { DashboardContextProvider } from './Context/DashboardContextProvider.jsx';
import UrlDashboard from '../src/Dashboard/UrlDashboard.jsx'

const theme = localStorage.getItem('theme')
document.body.classList.add(theme)

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />
  },
  {
    path: "/sign-up",
    element: <SignUp />
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/dashboard/:id",
    element: <UserDashboard />
  },
  {
    path: '/url/:urlId',
    element: <UrlDashboard />
  }
])

createRoot(document.getElementById('root')).render(
  <UserContextProvider>
    <DashboardContextProvider>
      <RouterProvider router={router} />
    </DashboardContextProvider>
  </UserContextProvider>,
)
