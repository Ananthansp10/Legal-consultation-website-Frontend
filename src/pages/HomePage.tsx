import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import HowItWorks from '../components/HowItWorks';
import OurLawyers from '../components/OurLawyers';
import WhyChooseUs from '../components/WhyChooseUs';
import ConsultationModes from '../components/ConsultationModes';
import StatsTestimonials from '../components/StatsTestimonials';
import FAQ from '../components/FAQ';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

const HomePage = () => {
  return (
    <>
      <Header />
      <Hero />
      <HowItWorks />
      <OurLawyers />
      <WhyChooseUs />
      <ConsultationModes />
      <StatsTestimonials />
      <FAQ />
      <Contact />
      <Footer />
    </>
  );
};

export default HomePage;