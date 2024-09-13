import React, { useEffect, useState } from 'react'
import './App.css'
import Feature from './pages/Feature'
import Alerts from './pages/Alerts'
import Home from './pages/Home'
import Footer from './components/Footer'
import { useProvider } from './Context/UserContextProvider'
import { Navigate } from 'react-router'

function App() {
  const useUser = useProvider()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await useUser.getCurrentUser();
        setUser(currentUser);
        setLoading(false);

      } catch (error) {
        console.log("you are not logged in please login or register account");
      }
    };

    fetchUser();
  }, []);

  if (user) return <Navigate to={`/dashboard/${user.data._id}`} />

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
