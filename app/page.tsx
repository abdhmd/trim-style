import React from 'react'
import HeroSection from './components/Hero'
import ServicesSection from './components/Services'
import AboutSection from './components/About'
import ContactSection from './components/Contact'
const Home = () => {
  return (
    <main >
      <HeroSection />
      <ServicesSection />
      <AboutSection/>
      <ContactSection />
    </main>
  )
}

export default Home