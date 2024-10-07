import React from 'react'
import './App.css'
import Feature from './pages/Feature'
import Alerts from './pages/Alerts'
import Home from './pages/Home'
import Footer from './components/Footer'
import { useUserContext } from './Context/UserContextProvider'
import { Navigate } from 'react-router'

function App() {

  const useAuth = useUserContext()

  if (useAuth.user) return <Navigate to={`/dashboard/user/${useAuth.user._id}`} />

  return (
    <div>
      <Home />
      <Feature />
      <Alerts />
      <Footer />
    </div>
  )
}

export default App
