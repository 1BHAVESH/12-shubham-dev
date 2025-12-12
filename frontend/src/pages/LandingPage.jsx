import About from '@/components/About'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import HeroImage from '@/components/HeroImage'
import Navbar from '@/components/Navbar'
import Projects from '@/components/Projects'
import StatsSection from '@/components/StartSection'
import Testimonials from '@/components/Testimonials'
import React from 'react'

const RealEstateLanding = () => {
  return (
    <div>
      
      <HeroImage />
      <About />
      <StatsSection />
      <Projects />
      <Testimonials />
      <Contact />
      
    </div>
  )
}

export default RealEstateLanding
