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

const theme = localStorage.getItem('theme')
document.body.classList.add(theme)

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />
  },
  {
    path: '/sign-up',
    element: <SignUp />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/login/reset-password',
    element: <Verify />
  },
  {
    path: '/login/create-new-password/:email',
    element: <CreateNewPassword />
  },
  {
    path: '/dashboard/user/:id',
    element: <UserDashboard />
  },
  {
    path: '/dashboard/profile/:userId',
    element: <Profile />
  },
  {
    path: '/dashboard/:id/url/:urlId',
    element: <UrlDashboard />
  }
]);

createRoot(document.getElementById('root')).render(
  <UserContextProvider>
    <DashboardContextProvider>
      <RouterProvider router={router} />
    </DashboardContextProvider>
  </UserContextProvider>,
)
