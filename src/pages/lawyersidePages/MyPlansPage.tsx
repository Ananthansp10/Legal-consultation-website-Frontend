import { useState, useMemo, useEffect } from "react";
import {
  Calendar,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Clock,
  Gift,
  ChevronDown,
  Hourglass,
} from "lucide-react";
import LawyerNavbar from "../../components/lawyer/Navbar";
import { getPurchasedPlans } from "../../services/lawyer/lawyerService";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

interface Plan {
  id: number;
  planName: string;
  date: string;
  activationDate: string;
  expireDate: string;
  price: number;
  totalAppointments: number;
  appointmentsCount: number;
  isActive: boolean;
}

interface TooltipProps {
  text: string;
  children: React.ReactNode;
}

export default function MyPlansPage(): JSX.Element {
  const [plans, setPlans] = useState<Plan[] | null>([]);

  const lawyerId: string | undefined = useSelector(
    (state: RootState) => state.lawyerAuth.lawyer?._id,
  );

  useEffect(() => {
    getPurchasedPlans(lawyerId ?? "").then((response) => {
      setPlans(response.data.data.plans || []);
    });
  }, []);

  const [sortBy, setSortBy] = useState<string>("recent");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const sortedPlans = useMemo((): Plan[] | undefined => {
    const filtered = plans?.filter((plan: Plan) =>
      filterStatus === "all"
        ? true
        : filterStatus == "active"
          ? plan.isActive
          : filterStatus == "expired"
            ? !plan.isActive
            : new Date() < new Date(plan.activationDate),
    );

    return filtered?.sort((a: Plan, b: Plan) => {
      switch (sortBy) {
        case "recent":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "price-high":
          return b.price - a.price;
        case "price-low":
          return a.price - b.price;
        case "expiry":
          return (
            new Date(a.expireDate).getTime() - new Date(b.expireDate).getTime()
          );
        default:
          return 0;
      }
    });
  }, [plans, sortBy, filterStatus]);

  const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getProgressPercentage = (used: number, total: number): number => {
    return Math.round((used / total) * 100);
  };

  const Tooltip = ({ text, children }: TooltipProps): JSX.Element => (
    <div className="relative group">
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10 pointer-events-none">
        {text}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="sticky top-0 z-50">
        <LawyerNavbar />
      </div>

      <div className="p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              My Subscriptions
            </h1>
            <p className="text-gray-600">
              Manage and view all your subscription plans
            </p>
          </div>

          {/* Controls */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sort */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Sort By
                </label>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer"
                  >
                    <option value="recent">Most Recent</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="expiry">Expiry Date</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Filter Status
                </label>
                <div className="relative">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer"
                  >
                    <option value="all">All Plans</option>
                    <option value="active">Active</option>
                    <option value="expired">Expired</option>
                    <option value="notActive">Not Active</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedPlans?.map((plan: Plan, idx: number) => (
              <div
                key={plan.id}
                className="transform transition-all duration-300 hover:scale-105 hover:shadow-2xl animate-in fade-in slide-in-from-bottom-4"
                style={{
                  animationDelay: `${idx * 50}ms`,
                  animationFillMode: "both",
                }}
              >
                <div
                  className={`h-full rounded-xl overflow-hidden shadow-lg ${
                    plan.isActive
                      ? "bg-white border-t-4 border-green-500"
                      : new Date() < new Date(plan.activationDate)
                        ? "bg-gray-50 border-t-4 border-blue-500"
                        : "bg-gray-50 border-t-4 border-red-500"
                  }`}
                >
                  {/* Card Header */}
                  <div
                    className={`p-6 ${
                      plan.isActive
                        ? "bg-gradient-to-r from-green-50 to-transparent"
                        : new Date() < new Date(plan.activationDate)
                          ? "bg-gradient-to-r from-blue-50 to-transparent"
                          : "bg-gradient-to-r from-red-50 to-transparent"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h2 className="text-2xl font-bold text-gray-900">
                        {plan.planName}
                      </h2>
                      <Tooltip text={`Status: ${plan.isActive}`}>
                        <div>
                          {plan.isActive ? (
                            <CheckCircle className="w-6 h-6 text-green-500" />
                          ) : new Date() < new Date(plan.activationDate) ? (
                            <Hourglass className="w-6 h-6 text-blue-500" />
                          ) : (
                            <AlertCircle className="w-6 h-6 text-red-500" />
                          )}
                        </div>
                      </Tooltip>
                    </div>
                    <div className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                      <DollarSign className="w-5 h-5 text-blue-500" />
                      {plan.price}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 space-y-4">
                    {/* Dates */}
                    <div className="space-y-3">
                      <Tooltip text={`Plan was purchased on this date`}>
                        <div className="flex items-start gap-3">
                          <Gift className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-gray-500 uppercase">
                              Purchase
                            </p>
                            <p className="text-sm text-gray-700">
                              {formatDate(plan.date)}
                            </p>
                          </div>
                        </div>
                      </Tooltip>

                      <Tooltip text={`Plan activation date`}>
                        <div className="flex items-start gap-3">
                          <Calendar className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-gray-500 uppercase">
                              Active From
                            </p>
                            <p className="text-sm text-gray-700">
                              {formatDate(plan.activationDate)}
                            </p>
                          </div>
                        </div>
                      </Tooltip>

                      <Tooltip text={`Plan expiration date`}>
                        <div className="flex items-start gap-3">
                          <Clock className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-gray-500 uppercase">
                              Expires
                            </p>
                            <p className="text-sm text-gray-700">
                              {formatDate(plan.expireDate)}
                            </p>
                          </div>
                        </div>
                      </Tooltip>
                    </div>

                    {/* Appointments Progress */}
                    <div className="pt-2 border-t border-gray-200">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-xs font-semibold text-gray-600 uppercase">
                          Appointments Used
                        </p>
                        <Tooltip
                          text={`${plan.appointmentsCount} of ${plan.totalAppointments} appointments used`}
                        >
                          <span className="text-sm font-semibold text-gray-900">
                            {plan.appointmentsCount}/{plan.totalAppointments}
                          </span>
                        </Tooltip>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
                          style={{
                            width: `${getProgressPercentage(plan.appointmentsCount, plan.totalAppointments)}%`,
                          }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {plan.totalAppointments - plan.appointmentsCount}{" "}
                        remaining
                      </p>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <button
                      className="w-full py-2 px-4 rounded-lg font-medium transition-all duration-300 hover:shadow-md text-white"
                      style={{
                        backgroundColor: plan.isActive
                          ? "green"
                          : new Date() < new Date(plan.activationDate)
                            ? "blue"
                            : "#ef4444",
                      }}
                    >
                      {plan.isActive
                        ? "Manage Plan"
                        : new Date() < new Date(plan.activationDate)
                          ? "Not Active"
                          : "Renew Plan"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {sortedPlans?.length === 0 && (
            <div className="text-center py-16">
              <Gift className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No plans found
              </h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
