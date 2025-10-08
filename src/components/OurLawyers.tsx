import { useEffect, useState } from "react";
import { Star, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getTopLawyers } from "../services/user/userService";

const OurLawyers = () => {
  const [activeFilter, setActiveFilter] = useState("All");

  const navigate = useNavigate();

  const filters = [
    "All",
    "Civil Law",
    "Criminal Law",
    "Family Law",
    "Corporate Law",
    "Immigration Law",
  ];

  interface LawyerData {
    lawyerId: string;
    name: string;
    profileImage: string;
    state: string;
    country: string;
    experience: string;
    specialization: string[];
  }

  const [lawyers, setLawyers] = useState<LawyerData[] | null>(null);

  useEffect(() => {
    getTopLawyers().then((response) => {
      setLawyers(response.data.data.slice(0, 6));
    });
  }, []);

  const filteredLawyers =
    activeFilter === "All"
      ? lawyers
      : lawyers?.filter((lawyer) =>
          lawyer.specialization.includes(activeFilter),
        );

  return (
    <section
      id="lawyers"
      className="py-20 bg-gradient-to-br from-slate-50 to-blue-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-4">
            Our Expert Lawyers
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
            Connect with verified, experienced lawyers who specialize in your
            area of need.
          </p>

          {/* Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-2">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-2 rounded-full transition-all duration-300 ${
                  activeFilter === filter
                    ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
                    : "bg-white/60 backdrop-blur-sm text-slate-600 hover:bg-white/80 border border-white/20"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredLawyers?.map((lawyer) => (
            <div
              key={lawyer.lawyerId}
              className="group bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <div className="text-center">
                <div className="relative mb-6">
                  <img
                    src={lawyer.profileImage}
                    alt={lawyer.name}
                    className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-white shadow-lg"
                  />
                  <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                </div>

                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  {lawyer.name}
                </h3>
                <p className="text-blue-500 font-semibold mb-2">
                  {lawyer.specialization[0]}
                </p>
                <p className="text-sm text-slate-600 mb-4">
                  {lawyer.experience} experience
                </p>

                <div className="flex items-center justify-center space-x-1 mb-6">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="font-bold text-slate-800">{}</span>
                  <span className="text-slate-600">({} reviews)</span>
                </div>

                <button
                  onClick={() => navigate("/auth/signin")}
                  className="group/btn w-full flex items-center justify-center space-x-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25"
                >
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
