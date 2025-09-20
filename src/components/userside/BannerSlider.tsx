import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const BannerSlider: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      image: 'https://images.pexels.com/photos/5668882/pexels-photo-5668882.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      title: 'Expert Legal Consultation',
      subtitle: 'Connect with experienced lawyers instantly'
    },
    {
      id: 2,
      image: 'https://images.pexels.com/photos/4427430/pexels-photo-4427430.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      title: 'Corporate Law Specialists',
      subtitle: 'Professional legal services for your business'
    },
    {
      id: 3,
      image: 'https://images.pexels.com/photos/5673488/pexels-photo-5673488.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      title: 'Family Law Experts',
      subtitle: 'Compassionate legal support when you need it most'
    },
    {
      id: 4,
      image: 'https://images.pexels.com/photos/4427611/pexels-photo-4427611.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      title: 'Criminal Defense',
      subtitle: 'Dedicated advocacy for your legal rights'
    },
    {
      id: 5,
      image: 'https://images.pexels.com/photos/5668473/pexels-photo-5668473.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      title: 'Real Estate Law',
      subtitle: 'Navigate property transactions with confidence'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative h-64 md:h-80 lg:h-96 rounded-2xl overflow-hidden shadow-xl mb-8">
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent">
              <div className="flex flex-col justify-center h-full px-8 md:px-12">
                <h2 className="text-2xl md:text-4xl font-bold text-white mb-2">
                  {slide.title}
                </h2>
                <p className="text-lg md:text-xl text-white/90">
                  {slide.subtitle}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-2 rounded-full transition-all duration-200"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-2 rounded-full transition-all duration-200"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${index === currentSlide
              ? 'bg-white'
              : 'bg-white/40 hover:bg-white/60'
              }`}
          />
        ))}
      </div>
    </div>
  );
};

export default BannerSlider;