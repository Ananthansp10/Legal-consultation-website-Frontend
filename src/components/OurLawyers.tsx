import React, { useState } from 'react';
import { Star, Eye } from 'lucide-react';

const OurLawyers = () => {
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'Civil', 'Criminal', 'Family', 'Corporate', 'Immigration'];

  const lawyers = [
    {
      id: 1,
      name: "Sarah Johnson",
      specialization: "Civil Law",
      rating: 4.9,
      reviews: 127,
      image: "https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=300",
      experience: "15 years"
    },
    {
      id: 2,
      name: "Michael Chen",
      specialization: "Criminal Law",
      rating: 4.8,
      reviews: 89,
      image: "https://images.pexels.com/photos/5668772/pexels-photo-5668772.jpeg?auto=compress&cs=tinysrgb&w=300",
      experience: "12 years"
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      specialization: "Family Law",
      rating: 4.9,
      reviews: 156,
      image: "https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=300",
      experience: "18 years"
    },
    {
      id: 4,
      name: "David Thompson",
      specialization: "Corporate Law",
      rating: 4.7,
      reviews: 98,
      image: "https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=300",
      experience: "20 years"
    },
    {
      id: 5,
      name: "Lisa Wang",
      specialization: "Immigration Law",
      rating: 4.8,
      reviews: 112,
      image: "https://images.pexels.com/photos/3760069/pexels-photo-3760069.jpeg?auto=compress&cs=tinysrgb&w=300",
      experience: "10 years"
    },
    {
      id: 6,
      name: "Robert Davis",
      specialization: "Civil Law",
      rating: 4.6,
      reviews: 73,
      image: "https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=300",
      experience: "8 years"
    }
  ];

  const filteredLawyers = activeFilter === 'All'
    ? lawyers
    : lawyers.filter(lawyer => lawyer.specialization.includes(activeFilter));

  return (
    <section id="lawyers" className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-4">
            Our Expert Lawyers
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
            Connect with verified, experienced lawyers who specialize in your area of need.
          </p>

          {/* Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-2">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-2 rounded-full transition-all duration-300 ${activeFilter === filter
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                    : 'bg-white/60 backdrop-blur-sm text-slate-600 hover:bg-white/80 border border-white/20'
                  }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredLawyers.map((lawyer) => (
            <div key={lawyer.id} className="group bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="text-center">
                <div className="relative mb-6">
                  <img
                    src={lawyer.image}
                    alt={lawyer.name}
                    className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-white shadow-lg"
                  />
                  <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                </div>

                <h3 className="text-xl font-bold text-slate-800 mb-2">{lawyer.name}</h3>
                <p className="text-blue-500 font-semibold mb-2">{lawyer.specialization}</p>
                <p className="text-sm text-slate-600 mb-4">{lawyer.experience} experience</p>

                <div className="flex items-center justify-center space-x-1 mb-6">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="font-bold text-slate-800">{lawyer.rating}</span>
                  <span className="text-slate-600">({lawyer.reviews} reviews)</span>
                </div>

                <button className="group/btn w-full flex items-center justify-center space-x-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25">
                  <Eye className="h-4 w-4" />
                  <span>View Profile</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurLawyers;