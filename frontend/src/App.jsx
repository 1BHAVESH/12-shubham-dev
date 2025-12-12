import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import LandingPage from './pages/LandingPage'
import AppRoutes from './router/AppRouter'

function App() {
  const [count, setCount] = useState(0)

  useEffect(() => {
  const path = window.location.pathname;

  
  if (path.startsWith("/admin")) return;

  // Only increase view on public website
  if (!localStorage.getItem("website_viewed")) {
    fetch("http://localhost:3001/api/view/website", {
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
