import { useEffect, useState } from 'react';
import { Search, MapPin, Star, Calendar, Phone, Mail, Briefcase, Scale, Home, Users, Shield, Building } from 'lucide-react';
import UserNavbar from '../../components/userside/Navbar';
import { useNavigate } from 'react-router-dom';
import { filterLawyerBySpecialization, getLawyers, searchLawyer } from '../../services/user/userService';


const specializations = [
  { id: 'all', name: 'All Specializations', icon: Scale },
  { id: 'corporate', name: 'Corporate Law', icon: Building },
  { id: 'criminal', name: 'Criminal Defense', icon: Shield },
  { id: 'family', name: 'Family Law', icon: Users },
  { id: 'property', name: 'Property Law', icon: Home },
  { id: 'civil', name: 'Civil Litigation', icon: Briefcase },
  { id: 'immigration', name: 'Immigration', icon: Scale },
];

interface LawyerData {
  lawyerId: string;
  name: string;
  specialization: string[];
  experience: string;
  country: string;
  state: string;
  profileImage: string;
}

function LawyerListingPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [lawyers, setLawyers] = useState<LawyerData[]>([])

  function fetchLawyers() {
    getLawyers().then((response) => {
      setLawyers(response.data.data)
    })
  }

  function searchLawyerByName() {
    searchLawyer(searchQuery).then((response) => {
      setLawyers(response.data.data)
    })
  }

  function filterLawyer(specializationId: string, specialization: string) {
    setActiveFilter(specializationId)
    filterLawyerBySpecialization(specialization).then((response) => {
      console.log(response.data.data)
      setLawyers(response.data.data)
    })
  }

  useEffect(() => {
    fetchLawyers()
  }, [])

  const navigate = useNavigate()

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={`${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
          }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Navigation */}
      <UserNavbar navLink='Lawyers' />
      {/* Search and Filter Section */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Search Bar */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search lawyers by name, specialization, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-inner transition-all duration-200"
              style={{
                boxShadow: 'inset 2px 2px 5px rgba(0, 0, 0, 0.1), inset -2px -2px 5px rgba(255, 255, 255, 0.7)'
              }}
            />
            <button onClick={searchLawyerByName} className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
              Search
            </button>
          </div>

          {/* Filter Pills */}
          <div className="flex space-x-3 overflow-x-auto pb-2">
            {specializations.map((spec) => {
              const IconComponent = spec.icon;
              return (
                <button
                  key={spec.id}
                  onClick={() => filterLawyer(spec.id, spec.name)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${activeFilter === spec.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  style={
                    activeFilter === spec.id
                      ? {}
                      : {
                        boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.1), -2px -2px 5px rgba(255, 255, 255, 0.7)'
                      }
                  }
                >
                  <IconComponent size={16} />
                  <span>{spec.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {activeFilter === 'all' ? 'All Lawyers' : `${specializations.find(s => s.id === activeFilter)?.name} Specialists`}
          </h2>
          <p className="text-gray-600">{lawyers.length} experienced lawyers available</p>
        </div>

        {/* Lawyer Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {lawyers.map((lawyer) => (
            <div
              key={lawyer?.lawyerId}
              className="bg-white rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl"
              style={{
                boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.1), -8px -8px 16px rgba(255, 255, 255, 0.7)',
                border: '1px solid #e2e8f0'
              }}
            >
              {/* Profile Photo */}
              <div className="flex justify-center mb-4">
                <div
                  className="w-20 h-20 rounded-full overflow-hidden"
                  style={{
                    boxShadow: 'inset 3px 3px 6px rgba(0, 0, 0, 0.1), inset -3px -3px 6px rgba(255, 255, 255, 0.7)'
                  }}
                >
                  <img
                    src={lawyer?.profileImage}
                    alt={lawyer?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Lawyer Info */}
              <div className="text-center mb-4">
                <h3 className="text-lg font-bold text-gray-900 mb-1">{lawyer.name}</h3>
                <div className="flex flex-wrap justify-center gap-1 mb-2">
                  <span
                    className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium"
                  >
                    {lawyer?.specialization[0]}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{ }</p>
              </div>

              {/* Experience and Location */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                  <Calendar size={14} />
                  <span>{lawyer?.experience}+ years</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                  <MapPin size={14} />
                  <span>{lawyer?.country},{lawyer?.state}</span>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center justify-center space-x-2 mb-4">
                <div className="flex items-center space-x-1">
                  {renderStars(123)}
                </div>
                <span className="text-sm font-medium text-gray-900">{ }</span>
                <span className="text-sm text-gray-500">({ } reviews)</span>
              </div>

              {/* CTA Button */}
              <button onClick={() => navigate(`/user/lawyer-view-page/${lawyer?.lawyerId}`)}
                className="w-full py-3 px-4 bg-gray-50 text-blue-600 rounded-xl font-medium transition-all duration-200 hover:bg-blue-600 hover:text-white hover:shadow-lg"
                style={{
                  boxShadow: '3px 3px 6px rgba(0, 0, 0, 0.1), -3px -3px 6px rgba(255, 255, 255, 0.7)'
                }}
              >
                View Profile
              </button>
            </div>
          ))}
        </div>

        {/* Load More */}
        {/* <div className="text-center mt-12">
          <button
            className="px-8 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium transition-all duration-200 hover:bg-gray-200 hover:shadow-lg"
            style={{
              boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.1), -4px -4px 8px rgba(255, 255, 255, 0.7)'
            }}
          >
            Load More Lawyers
          </button>
        </div> */}
      </main>
    </div>
  );
}

export default LawyerListingPage;