import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css'
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";
import WebsiteMoniter from './Dashboard/WebsiteMoniter.jsx';
import SignUp from './Authentication/SignUp.jsx';
import Login from './Authentication/Login.jsx'
import { UserContextProvider } from './Context/UserContextProvider.jsx';
import { DashboardContextProvider } from './Context/DashboardContextProvider.jsx';
import WebUrlDashboard from '../src/Dashboard/WebUrlDashboard.jsx'

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
    element: <WebsiteMoniter />
  },
  {
    path: '/url/:urlId',
    element: <WebUrlDashboard />
  }
])

createRoot(document.getElementById('root')).render(
  <UserContextProvider>
    <DashboardContextProvider>
      <RouterProvider router={router} />
    </DashboardContextProvider>
  </UserContextProvider>,
)
