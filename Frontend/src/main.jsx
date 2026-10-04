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
import Verify from './Authentication/Verify.jsx';
import CreateNewPassword from './Authentication/CreateNewPassword.jsx';
import Profile from './pages/Profile.jsx';
import RouteErrorPage from './components/RouteErrorPage.jsx';

const theme = localStorage.getItem('theme')
document.body.classList.toggle('dark', theme === 'dark')

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <RouteErrorPage />
  },
  {
    path: '/sign-up',
    element: <SignUp />,
    errorElement: <RouteErrorPage />
  },
  {
    path: '/login',
    element: <Login />,
    errorElement: <RouteErrorPage />
  },
  {
    path: '/login/reset-password',
    element: <Verify />,
    errorElement: <RouteErrorPage />
  },
  {
    path: '/login/create-new-password/:email',
    element: <CreateNewPassword />,
    errorElement: <RouteErrorPage />
  },
  {
    path: '/dashboard/user/:id',
    element: <UserDashboard />,
    errorElement: <RouteErrorPage />
  },
  {
    path: '/dashboard/profile/:userId',
    element: <Profile />,
    errorElement: <RouteErrorPage />
  },
  {
    path: '/dashboard/:id/url/:urlId',
    element: <UrlDashboard />,
    errorElement: <RouteErrorPage />
  }
]);

createRoot(document.getElementById('root')).render(
  <UserContextProvider>
    <DashboardContextProvider>
      <RouterProvider router={router} />
    </DashboardContextProvider>
  </UserContextProvider>,
)
