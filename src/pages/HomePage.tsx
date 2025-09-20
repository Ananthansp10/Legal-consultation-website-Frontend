
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
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../redux/store';

const HomePage = () => {
  const user = useSelector((state: RootState) => state.auth.user)
  console.log(user)
  const navigate = useNavigate()
  useEffect(() => {
    if (user) {
      navigate('/user-dashboard')
    }
  }, [user])
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