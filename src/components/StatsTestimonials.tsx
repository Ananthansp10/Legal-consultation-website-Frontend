import React, { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

const StatsTestimonials = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  
  const stats = [
    { number: 5000, label: "Happy Clients", suffix: "+" },
    { number: 100, label: "Expert Lawyers", suffix: "+" },
    { number: 98, label: "Success Rate", suffix: "%" },
    { number: 24, label: "Support Hours", suffix: "/7" }
  ];

  const testimonials = [
    {
      name: "Jennifer Martinez",
      role: "Business Owner",
      content: "LegalConnect helped me find the perfect lawyer for my business needs. The process was smooth and professional.",
      rating: 5,
      image: "https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=100"
    },
    {
      name: "Robert Johnson",
      role: "Individual Client",
      content: "Excellent service! The lawyer I connected with was knowledgeable and helped resolve my case efficiently.",
      rating: 5,
      image: "https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=100"
    },
    {
      name: "Sarah Chen",
      role: "Family Client",
      content: "Professional, reliable, and compassionate. I couldn't have asked for better legal representation.",
      rating: 5,
      image: "https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=100"
    }
  ];

  const [animatedStats, setAnimatedStats] = useState(stats.map(() => 0));

  useEffect(() => {
    const timers = stats.map((stat, index) => {
      return setTimeout(() => {
        const increment = stat.number / 50;
        let current = 0;
        const timer = setInterval(() => {
          current += increment;
          if (current >= stat.number) {
            current = stat.number;
            clearInterval(timer);
          }
          setAnimatedStats(prev => {
            const newStats = [...prev];
            newStats[index] = Math.floor(current);
            return newStats;
          });
        }, 30);
      }, index * 200);
    });

    return () => timers.forEach(timer => clearTimeout(timer));
  }, []);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Stats Section */}
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-8">
              Trusted by Thousands
            </h2>
            <div className="grid grid-cols-2 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 text-center">
                  <div className="text-3xl lg:text-4xl font-bold text-blue-500 mb-2">
                    {animatedStats[index]}{stat.suffix}
                  </div>
                  <div className="text-slate-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonials Section */}
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-8">
              What Our Clients Say
            </h2>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 relative">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <img
                    src={testimonials[currentTestimonial].image}
                    alt={testimonials[currentTestimonial].name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-bold text-slate-800">{testimonials[currentTestimonial].name}</div>
                    <div className="text-slate-600 text-sm">{testimonials[currentTestimonial].role}</div>
                  </div>
                </div>
                
                <div className="flex space-x-1">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
              
              <p className="text-slate-600 leading-relaxed mb-6">
                "{testimonials[currentTestimonial].content}"
              </p>
              
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonial(index)}
                      className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                        index === currentTestimonial ? 'bg-blue-500' : 'bg-slate-300'
                      }`}
                    />
                  ))}
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={prevTestimonial}
                    className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors duration-200"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={nextTestimonial}
                    className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors duration-200"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsTestimonials;