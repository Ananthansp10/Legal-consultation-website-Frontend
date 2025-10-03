import React, { useState, useEffect } from "react";
import {
  Check,
  X,
  Star,
  Shield,
  Users,
  Zap,
  Crown,
  Award,
  Briefcase,
} from "lucide-react";
import LawyerNavbar from "../../components/lawyer/Navbar";
import {
  addPlan,
  createRazorpayOrder,
  getSubscriptionPlans,
} from "../../services/lawyer/lawyerService";
import { openRazorpayCheckout } from "../../config/razorpayCheckout";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

interface Plan {
  _id: string;
  name: string;
  planType: string;
  price: number;
  duration: number;
  currency?: string;
  status: boolean;
  features: string[];
  popular?: boolean;
  icon?: React.ReactNode;
}

function SubscriptionPlanPage() {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [subscriptionPlans, setSubscriptionPlans] = useState<Plan[]>([]);

  const navigate = useNavigate();
  const lawyerId: string | undefined = useSelector(
    (state: RootState) => state?.lawyerAuth?.lawyer?._id
  );

  const getColorScheme = (
    index: number,
    planName: string,
    duration: number
  ) => {
    const colorSchemes = [
      {
        gradient: "from-purple-500 via-pink-500 to-red-500",
        bgGradient: "from-purple-50 to-pink-50",
        border: "border-purple-200/50",
        icon: "bg-purple-100 text-purple-600",
        button:
          "from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600",
        shadow: "shadow-purple-200/50",
        accent: "text-purple-600",
      },
      {
        gradient: "from-blue-500 via-cyan-500 to-teal-500",
        bgGradient: "from-blue-50 to-cyan-50",
        border: "border-blue-200/50",
        icon: "bg-blue-100 text-blue-600",
        button:
          "from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600",
        shadow: "shadow-blue-200/50",
        accent: "text-blue-600",
      },
      {
        gradient: "from-emerald-500 via-green-500 to-teal-500",
        bgGradient: "from-emerald-50 to-green-50",
        border: "border-emerald-200/50",
        icon: "bg-emerald-100 text-emerald-600",
        button:
          "from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600",
        shadow: "shadow-emerald-200/50",
        accent: "text-emerald-600",
      },
      {
        gradient: "from-orange-500 via-amber-500 to-yellow-500",
        bgGradient: "from-orange-50 to-amber-50",
        border: "border-orange-200/50",
        icon: "bg-orange-100 text-orange-600",
        button:
          "from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600",
        shadow: "shadow-orange-200/50",
        accent: "text-orange-600",
      },
      {
        gradient: "from-indigo-500 via-purple-500 to-pink-500",
        bgGradient: "from-indigo-50 to-purple-50",
        border: "border-indigo-200/50",
        icon: "bg-indigo-100 text-indigo-600",
        button:
          "from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600",
        shadow: "shadow-indigo-200/50",
        accent: "text-indigo-600",
      },
    ];

    // Special color scheme for most popular plan (highest duration)
    if (duration > 200) {
      return {
        gradient: "from-yellow-400 via-orange-500 to-red-500",
        bgGradient: "from-yellow-50/80 to-orange-50/80",
        border: "border-yellow-300/60",
        icon: "bg-gradient-to-r from-yellow-400 to-orange-500 text-white",
        button:
          "from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600",
        shadow: "shadow-yellow-200/60",
        accent: "text-orange-600",
        special: true,
      };
    }

    return colorSchemes[index % colorSchemes.length];
  };

  // Dynamic icon selection based on plan type or name
  const getPlanIcon = (planName: string, planType: string, index: number) => {
    const name = planName.toLowerCase();
    const type = planType.toLowerCase();

    if (
      name.includes("premium") ||
      name.includes("pro") ||
      type.includes("premium")
    ) {
      return <Crown className="w-6 h-6" />;
    } else if (
      name.includes("basic") ||
      name.includes("starter") ||
      type.includes("basic")
    ) {
      return <Users className="w-6 h-6" />;
    } else if (
      name.includes("enterprise") ||
      name.includes("business") ||
      type.includes("enterprise")
    ) {
      return <Briefcase className="w-6 h-6" />;
    } else if (name.includes("standard") || type.includes("standard")) {
      return <Shield className="w-6 h-6" />;
    } else {
      const icons = [
        <Star className="w-6 h-6" />,
        <Zap className="w-6 h-6" />,
        <Award className="w-6 h-6" />,
      ];
      return icons[index % icons.length];
    }
  };

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    getSubscriptionPlans().then((response) => {
      setSubscriptionPlans(response.data.data);
    });
  }, []);

  const openPurchaseModal = (plan: Plan) => {
    if (plan.status) {
      setSelectedPlan(plan);
      setIsModalOpen(true);
    }
  };

  const closePurchaseModal = () => {
    setSelectedPlan(null);
    setIsModalOpen(false);
  };

  const formatPrice = (
    price: number,
    currency: string = "₹",
    duration: number
  ) => {
    if (price === 0) return "Free";
    return `${currency}${price.toLocaleString()} / ${duration} days`;
  };

  function executePayment(planId: string, price: number) {
    createRazorpayOrder(planId, price).then((response) => {
      console.log(response);
      openRazorpayCheckout(response.data.data)
        .then(() => {
          addPlan(lawyerId!, planId, price).then(() => {
            toast.success("Payment successfull");
            setTimeout(() => {
              setIsModalOpen(false);
              navigate("/lawyer-dashboard");
            }, 2000);
          });
        })
        .catch((error) => {
          setIsModalOpen(false);
          toast.error(error.response.data.message);
        });
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.08),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.08),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.05),transparent_70%)]"></div>

      {/* Animated background elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-purple-200/30 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute top-40 right-20 w-32 h-32 bg-blue-200/30 rounded-full blur-xl animate-pulse delay-1000"></div>
      <div className="absolute bottom-20 left-1/3 w-24 h-24 bg-green-200/30 rounded-full blur-xl animate-pulse delay-2000"></div>

      <LawyerNavbar />

      <div className="relative z-10 container mx-auto px-6 py-12">
        <header className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-lg">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-6 tracking-tight">
            Choose Your Legal Plan
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Transform your legal practice with our premium subscription plans.
            <span className="text-blue-600 font-semibold">
              {" "}
              Tailored for professionals who demand excellence.
            </span>
          </p>
        </header>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16">
          {subscriptionPlans?.map((plan, index) => {
            const colorScheme = getColorScheme(index, plan.name, plan.duration);
            const planIcon = getPlanIcon(plan.name, plan.planType, index);

            return (
              <div
                key={plan?._id}
                className={`relative group transform transition-all duration-700 ${
                  isLoaded
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0"
                }`}
                style={{
                  transitionDelay: `${index * 150}ms`,
                }}
              >
                {/* Popular Badge */}
                {plan.duration > 200 && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <span
                      className={`bg-gradient-to-r ${colorScheme.gradient} text-white px-6 py-2 rounded-full text-sm font-bold shadow-xl animate-pulse`}
                    >
                      ⭐ Most Popular
                    </span>
                  </div>
                )}

                <div
                  className={`
                  relative h-full p-8 rounded-3xl backdrop-blur-sm border-2 ${
                    colorScheme.border
                  } 
                  bg-gradient-to-br ${colorScheme.bgGradient} shadow-xl ${
                    colorScheme.shadow
                  }
                  transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-opacity-80
                  ${!plan?.status ? "opacity-60 grayscale" : ""}
                  ${colorScheme ? "ring-2 ring-yellow-400/30" : ""}
                `}
                >
                  {/* Decorative corner accent */}
                  <div
                    className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl ${colorScheme.gradient} opacity-10 rounded-bl-full rounded-tr-3xl`}
                  ></div>

                  {/* Plan Header */}
                  <div className="flex items-center mb-6 relative z-10">
                    <div
                      className={`
                      p-4 rounded-2xl mr-4 shadow-lg
                      ${colorScheme.icon}
                      ${colorScheme ? "shadow-yellow-200/50" : ""}
                    `}
                    >
                      {planIcon}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-800">
                        {plan.name}
                      </h3>
                      <p
                        className={`text-sm font-semibold ${colorScheme.accent}`}
                      >
                        {plan.planType}
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="mb-6">
                    <span
                      className={`
                      inline-flex items-center px-4 py-2 rounded-full text-sm font-bold shadow-md
                      ${
                        plan.status
                          ? "bg-green-100 text-green-700 border-2 border-green-200"
                          : "bg-red-100 text-red-700 border-2 border-red-200"
                      }
                    `}
                    >
                      {plan.status ? (
                        <>
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                          Active
                        </>
                      ) : (
                        <>
                          <X className="w-4 h-4 mr-2" />
                          Inactive
                        </>
                      )}
                    </span>
                  </div>

                  {/* Pricing */}
                  <div className="mb-8">
                    <div className="text-4xl font-bold text-slate-800 mb-2">
                      {formatPrice(
                        plan.price,
                        plan.currency || "₹",
                        plan.duration
                      )}
                    </div>
                    {plan.price > 0 && (
                      <div
                        className={`text-sm font-medium ${colorScheme.accent}`}
                      >
                        {plan.duration} days coverage
                      </div>
                    )}
                  </div>

                  {/* Features */}
                  <div className="mb-8 flex-grow">
                    <ul className="space-y-4">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start group">
                          <div
                            className={`
                            w-5 h-5 rounded-full bg-gradient-to-r ${colorScheme.gradient} 
                            flex items-center justify-center mr-3 flex-shrink-0 mt-0.5 
                            shadow-md group-hover:shadow-lg transition-shadow duration-200
                          `}
                          >
                            <Check className="w-3 h-3 text-white font-bold" />
                          </div>
                          <span className="text-slate-700 text-sm leading-relaxed font-medium">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Purchase Button */}
                  <button
                    onClick={() => openPurchaseModal(plan)}
                    disabled={!plan.status}
                    className={`
                      w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300
                      transform hover:scale-105 focus:outline-none focus:ring-4 
                      shadow-xl hover:shadow-2xl relative overflow-hidden
                      ${
                        plan.status
                          ? `bg-gradient-to-r ${colorScheme.button} text-white focus:ring-blue-500/25`
                          : "bg-gray-200 text-gray-500 cursor-not-allowed shadow-none"
                      }
                    `}
                  >
                    {plan.status && (
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    )}
                    <span className="relative z-10">
                      {!plan.status
                        ? "Currently Unavailable"
                        : plan.price === 0
                        ? "✅ Free Plan"
                        : "🚀 Get Started Now"}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Enhanced Footer Note */}
        <div className="text-center">
          <div className="bg-white/40 backdrop-blur-xl rounded-2xl px-8 py-6 inline-block border-2 border-white/30 shadow-xl">
            <p className="text-lg text-slate-700 mb-2">
              <span className="font-bold text-slate-800">
                Need something custom?
              </span>
            </p>
            <a
              href="#"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-bold underline decoration-2 underline-offset-4 hover:decoration-blue-700 transition-colors duration-200"
            >
              💬 Contact our support team
            </a>
          </div>
        </div>
      </div>

      {/* Enhanced Purchase Modal */}
      {isModalOpen && selectedPlan && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl border-2 border-gray-200/50 shadow-2xl max-w-lg w-full p-8 transform transition-all duration-300 scale-100">
            {/* Modal Header */}
            <div className="flex items-center mb-6">
              <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl mr-4 shadow-lg">
                {getPlanIcon(selectedPlan.name, selectedPlan.planType, 0)}
              </div>
              <div>
                <h3 className="text-3xl font-bold text-gray-800">
                  {selectedPlan.name}
                </h3>
                <p className="text-blue-600 font-semibold">
                  {selectedPlan.planType}
                </p>
              </div>
            </div>

            {/* Plan Details */}
            <div className="mb-8 p-6 bg-gradient-to-r from-blue-50/80 to-purple-50/80 rounded-2xl border-2 border-blue-200/30">
              <div className="text-4xl font-bold text-gray-800 mb-4">
                {formatPrice(
                  selectedPlan.price,
                  selectedPlan.currency || "₹",
                  selectedPlan.duration
                )}
              </div>

              <div className="space-y-3">
                {selectedPlan.features.slice(0, 4).map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-center text-sm text-gray-700"
                  >
                    <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mr-3">
                      <Check className="w-2.5 h-2.5 text-white" />
                    </div>
                    <span className="font-medium">{feature}</span>
                  </div>
                ))}
                {selectedPlan.features.length > 4 && (
                  <div className="text-sm text-blue-600 italic font-medium">
                    ✨ +{selectedPlan.features.length - 4} more premium features
                  </div>
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-4">
              <button
                onClick={closePurchaseModal}
                className="flex-1 py-3 px-6 border-2 border-gray-300 text-gray-700 rounded-2xl font-bold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  executePayment(selectedPlan._id, selectedPlan.price);
                }}
                className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-bold hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                💳 Pay & Subscribe
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SubscriptionPlanPage;
