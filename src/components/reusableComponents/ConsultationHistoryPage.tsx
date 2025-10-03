import {
  Calendar,
  Video,
  Phone,
  User,
  FileText,
  MessageSquare,
} from "lucide-react";
import LawyerNavbar from "../lawyer/Navbar";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getConsultationHistory } from "../../services/lawyer/lawyerService";

const ConsultationHistoryPage = () => {
  interface History {
    consultationDate: string;
    summaryNote: string;
    consultationMode: string;
    feedback: string;
    rating: number;
  }

  interface ConsultationHistoryData {
    userName: string;
    lawyerName: string;
    caseId: number;
    caseDescription: string;
    history: History;
  }

  const { caseId } = useParams();

  const [consultationHistoryData, setConsultationHistoryData] = useState<
    ConsultationHistoryData[] | null
  >(null);

  useEffect(() => {
    getConsultationHistory(caseId!).then((response) => {
      console.log(response.data.data);
      setConsultationHistoryData(response.data.data);
    });
  }, []);

  // Function to convert rating number to stars
  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <span key={index} className="text-yellow-400">
        {index < rating ? "⭐" : "☆"}
      </span>
    ));
  };

  // Function to get mode icon
  const getModeIcon = (mode: string) => {
    switch (mode.toLowerCase()) {
      case "online":
        return <Video className="w-5 h-5 text-blue-600" />;
      case "call":
        return <Phone className="w-5 h-5 text-green-600" />;
      case "in-person":
        return <User className="w-5 h-5 text-purple-600" />;
      default:
        return <MessageSquare className="w-5 h-5 text-gray-600" />;
    }
  };

  // Empty state component
  const EmptyState = () => (
    <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <p className="text-gray-600 text-lg">
        No previous consultation found for this case.
      </p>
      <p className="text-gray-500 text-sm mt-2">
        Your consultation history will appear here once you start consultations.
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 w-full z-50">
        <LawyerNavbar />
      </div>

      {/* Page content with padding to avoid overlap */}
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Consultation History
            </h1>
            <p className="text-gray-600">
              Review your previous consultations and case details
            </p>
          </div>

          {/* Case Information Card */}
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 mb-8">
            <div className="flex items-center mb-4">
              <FileText className="w-6 h-6 text-blue-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">
                Case Information
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Client Name
                  </label>
                  <p className="text-gray-900 font-medium">
                    {consultationHistoryData?.[0].userName}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Legal Counsel
                  </label>
                  <p className="text-gray-900 font-medium">
                    {consultationHistoryData?.[0].lawyerName}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Case ID
                  </label>
                  <p className="text-gray-900 font-medium font-mono bg-gray-100 px-2 py-1 rounded text-sm inline-block">
                    {consultationHistoryData?.[0].caseId}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Case Description
              </label>
              <p className="text-gray-700 mt-1 leading-relaxed">
                {consultationHistoryData?.[0].caseDescription}
              </p>
            </div>
          </div>

          {/* Consultation History Section */}
          <div className="mb-4">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Consultation History
            </h2>
          </div>

          {/* Consultation History Cards or Empty State */}
          {consultationHistoryData?.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-6">
              {consultationHistoryData?.map((consultation) => (
                <div
                  key={consultation.caseId}
                  className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="p-6">
                    {/* Header with Date and Mode */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 pb-4 border-b border-gray-100">
                      <div className="flex items-center mb-2 sm:mb-0">
                        <Calendar className="w-5 h-5 text-gray-500 mr-2" />
                        <span className="font-semibold text-gray-900">
                          {consultation.history.consultationDate}
                        </span>
                      </div>
                      <div className="flex items-center">
                        {getModeIcon(consultation.history.consultationMode)}
                        <span className="ml-2 text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                          {consultation.history.consultationMode}
                        </span>
                      </div>
                    </div>

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Lawyer's Note */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                          <FileText className="w-4 h-4 mr-1 text-blue-600" />
                          Lawyer's Summary
                        </h4>
                        <p className="text-gray-700 text-sm leading-relaxed bg-blue-50 p-3 rounded-lg">
                          {consultation.history.summaryNote}
                        </p>
                      </div>

                      {/* User Feedback and Rating */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                          <MessageSquare className="w-4 h-4 mr-1 text-green-600" />
                          Your Feedback
                        </h4>
                        <div className="bg-green-50 p-3 rounded-lg">
                          <p className="text-gray-700 text-sm leading-relaxed mb-3">
                            {consultation.history.feedback}
                          </p>
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-700 mr-2">
                              Rating:
                            </span>
                            <div className="flex items-center">
                              {renderStars(consultation.history.rating)}
                              <span className="ml-2 text-sm text-gray-600">
                                ({consultation.history.rating}/5)
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="mt-12 text-center text-gray-500 text-sm">
            <p>
              Need help with your case? Contact your legal counsel for
              assistance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultationHistoryPage;
