import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import LandingPage from './pages/LandingPage'
import AppRoutes from './router/AppRouter'

const API_URL=import.meta.env.VITE_API_URL ||" http://localhost:3001/"


function App() {
  const [count, setCount] = useState(0)

  useEffect(() => {
  const path = window.location.pathname;

  
  if (path.startsWith("/admin")) return;

  // Only increase view on public website
  if (!localStorage.getItem("website_viewed")) {
    fetch(`${API_URL}api/view/website`, {
      method: "GET",
    });

    localStorage.setItem("website_viewed", "true");
  }
}, []);


  return (
  <>
  
 <AppRoutes />
  </>
  )
}

export default App
