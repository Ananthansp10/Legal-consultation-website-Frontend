import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ImageSlider: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      title: "Legal Tips & Best Practices",
      description:
        "Stay updated with the latest legal insights and professional advice",
      image:
        "https://images.pexels.com/photos/3194521/pexels-photo-3194521.jpeg?auto=compress&cs=tinysrgb&w=800",
      category: "Legal Tips",
    },
    {
      id: 2,
      title: "Productivity Hacks for Lawyers",
      description:
        "Optimize your workflow and manage your practice more efficiently",
      image:
        "https://images.pexels.com/photos/5668473/pexels-photo-5668473.jpeg?auto=compress&cs=tinysrgb&w=800",
      category: "Productivity",
    },
    {
      id: 3,
      title: "Platform Updates & Announcements",
      description:
        "Latest features and improvements to enhance your experience",
      image:
        "https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=800",
      category: "Announcements",
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">
        Featured Content
      </h2>

      <div className="relative bg-white/70 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-200/50 shadow-lg">
        <div className="relative h-64 md:h-80 overflow-hidden">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
                index === currentSlide
                  ? "translate-x-0"
                  : index < currentSlide
                    ? "-translate-x-full"
                    : "translate-x-full"
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <span className="inline-block px-3 py-1 bg-blue-600 rounded-full text-sm font-medium mb-3">
                  {slide.category}
                </span>
                <h3 className="text-2xl font-bold mb-2">{slide.title}</h3>
                <p className="text-gray-200 max-w-2xl">{slide.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-all duration-200"
        >
          <ChevronLeft className="h-5 w-5 text-slate-700" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-all duration-200"
        >
          <ChevronRight className="h-5 w-5 text-slate-700" />
        </button>

        {/* Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentSlide ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageSlider;
