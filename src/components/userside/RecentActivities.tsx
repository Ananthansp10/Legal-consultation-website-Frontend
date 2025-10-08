import { BookOpen, Lightbulb, ShieldCheck } from "lucide-react";

export default function RecentActivities() {
  const tips = [
    {
      icon: <Lightbulb className="text-amber-500 w-4 h-4" />,
      title: "Check Contracts Carefully",
      description: "Review key clauses before signing",
    },
    {
      icon: <ShieldCheck className="text-emerald-500 w-4 h-4" />,
      title: "Know Your Rights",
      description: "Stay informed about consumer rights",
    },
    {
      icon: <BookOpen className="text-blue-500 w-4 h-4" />,
      title: "Keep Records Safe",
      description: "Maintain copies of all documents",
    },
    {
      icon: <Lightbulb className="text-amber-500 w-4 h-4" />,
      title: "Check Contracts Carefully",
      description: "Review key clauses before signing",
    },
    {
      icon: <ShieldCheck className="text-emerald-500 w-4 h-4" />,
      title: "Know Your Rights",
      description: "Stay informed about consumer rights",
    },
    {
      icon: <BookOpen className="text-blue-500 w-4 h-4" />,
      title: "Keep Records Safe",
      description: "Maintain copies of all documents",
    },
    {
      icon: <Lightbulb className="text-amber-500 w-4 h-4" />,
      title: "Check Contracts Carefully",
      description: "Review key clauses before signing",
    },
    {
      icon: <ShieldCheck className="text-emerald-500 w-4 h-4" />,
      title: "Know Your Rights",
      description: "Stay informed about consumer rights",
    },
    {
      icon: <BookOpen className="text-blue-500 w-4 h-4" />,
      title: "Keep Records Safe",
      description: "Maintain copies of all documents",
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-semibold text-gray-800">Knowledge Hub</h3>
        <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
          View All
        </button>
      </div>

      {/* Tips List */}
      <div className="space-y-2">
        {tips.map((tip, i) => (
          <div
            key={i}
            className="group p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <div className="flex items-start space-x-2">
              <div className="flex-shrink-0 mt-0.5">{tip.icon}</div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-medium text-gray-800 truncate">
                  {tip.title}
                </h4>
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                  {tip.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
