import React from 'react';
import { Calendar, Search, ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <section id="home" className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-16 flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <div className="space-y-8">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
              <h1 className="text-4xl lg:text-6xl font-bold text-slate-800 mb-6 leading-tight">
                Find the Perfect
                <span className="text-blue-500 block">Legal Expert</span>
              </h1>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Connect with top-rated lawyers in your area. Get expert legal advice and representation tailored to your specific needs.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="group flex items-center justify-center space-x-2 px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 hover:scale-105">
                  <Calendar className="h-5 w-5" />
                  <span className="font-semibold">Book a Consultation</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>

                <button className="group flex items-center justify-center space-x-2 px-8 py-4 bg-white/80 backdrop-blur-sm hover:bg-white/90 text-slate-700 rounded-xl border border-white/30 transition-all duration-300 hover:shadow-lg hover:scale-105">
                  <Search className="h-5 w-5" />
                  <span className="font-semibold">Find a Lawyer</span>
                </button>
              </div>
            </div>
          </div>

          {/* Hero Image/Illustration */}
          <div className="relative">
            <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
              <img
                src="https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Legal consultation"
                className="w-full h-96 object-cover rounded-xl"
              />

              {/* Floating Stats */}
              <div className="absolute -top-4 -right-4 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-500">5000+</div>
                  <div className="text-sm text-slate-600">Happy Clients</div>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">100+</div>
                  <div className="text-sm text-slate-600">Expert Lawyers</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;