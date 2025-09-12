import { useEffect, useState } from 'react';
import { Search, Filter, Eye, Shield, AlertTriangle, CheckCircle, Clock, User, Scale, X, Ban, AlertCircle } from 'lucide-react';
import Navbar from '../../components/admin/Navbar';
import { getReportedAccounts, updateReportedAccountStatus } from '../../services/admin/adminService';
import { updateUserStatus } from '../../services/admin/userListingService';
import { updateLawyerStatus } from '../../services/admin/lawyerListingService';
import { toast } from 'react-toastify';

interface ReportedAccount {
  _id: string;
  reportedUserProfileImage: string;
  reportedName: string;
  userType: 'user' | 'lawyer';
  reportedId: string;
  reportsCount: number;
  latestReportReason: string;
  status: 'Pending' | 'Reviewed' | 'Resolved';
  reports: Report[];
}

interface Report {
  reporterId: string;
  reporterName: string;
  reason: string;
  description: string;
  date: string;
}


const getStatusConfig = (status: ReportedAccount['status']) => {
  const configs = {
    Pending: {
      text: 'Pending',
      textColor: 'text-orange-700',
      bgColor: 'bg-orange-100',
      icon: <Clock className="w-4 h-4" />
    },
    Reviewed: {
      text: 'Reviewed',
      textColor: 'text-blue-700',
      bgColor: 'bg-blue-100',
      icon: <Eye className="w-4 h-4" />
    },
    Resolved: {
      text: 'Resolved',
      textColor: 'text-emerald-700',
      bgColor: 'bg-emerald-100',
      icon: <CheckCircle className="w-4 h-4" />
    }
  };
  return configs[status];
};

const ReportedAccountsPage = () => {
  const [activeTab, setActiveTab] = useState<'All' | 'users' | 'lawyers' | string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Resolved'>('All');
  const [reasonFilter, setReasonFilter] = useState<'All' | 'Harassment' | 'Fake Profile' | 'Scam' | 'Other'>('All');
  const [selectedAccount, setSelectedAccount] = useState<ReportedAccount | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refresh,setRefresh]=useState(false)

  const [reports,setReports]=useState<ReportedAccount[]>([])

  useEffect(()=>{
    getReportedAccounts(activeTab).then((response)=>{
      setReports(response.data.data)
    })
  },[activeTab,refresh])

  function takeAction(reportedId:string,userType:string,reportedAccountId:string){
    userType == 'user' ? updateUserStatus(reportedId,'block').then(()=>{
      updateReportedAccountStatus(reportedId).then(()=>{
        toast.success('Account Blocked')
        setRefresh(!refresh)
      })
    }) : updateLawyerStatus(reportedId,'block').then(()=>{
      updateReportedAccountStatus(reportedAccountId).then(()=>{
        toast.success('Account Blocked')
        setRefresh(!refresh)
      })
    })
  }

  const openModal = (account: ReportedAccount) => {
    setSelectedAccount(account);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAccount(null);
  };

  const tabs = [
    { key: 'All' as const, label: 'All', count: reports.length },
    { key: 'Users' as const, label: 'Users', count: reports.filter(a => a.userType === 'user').length },
    { key: 'Lawyers' as const, label: 'Lawyers', count: reports.filter(a => a.userType === 'lawyer').length }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto mt-1">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Reported Accounts
          </h1>
          <p className="text-gray-600 text-lg">
            View and manage reported users and lawyers
          </p>
        </div>

        {/* Main Container */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200/50 p-8">
          {/* Filter Tabs */}
          <div className="mb-8">
            <div className="flex gap-2 justify-center">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key.toLowerCase())}
                  className={`px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 ${
                    activeTab === tab.key
                      ? 'bg-blue-500 text-white shadow-lg scale-105'
                      : 'bg-white/70 text-gray-700 hover:bg-white hover:shadow-md hover:scale-105'
                  }`}
                >
                  {tab.label}
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                    activeTab === tab.key
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'Pending' | 'Resolved' | 'All')}
                className="w-full pl-10 pr-4 py-3 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 appearance-none"
              >
                <option value="All">All</option>
                <option value="Pending">Pending</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>

            {/* Reason Filter */}
            <div className="relative">
              <AlertTriangle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={reasonFilter}
                onChange={(e) => setReasonFilter(e.target.value as 'All' | 'Harassment' | 'Fake Profile' | 'Scam' | 'Other')}
                className="w-full pl-10 pr-4 py-3 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 appearance-none"
              >
                <option value="All">All Reasons</option>
                <option value="Harassment">Harassment</option>
                <option value="Fake Profile">Fake Information</option>
                <option value="Scam">Scam</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Reported Accounts Cards */}
          <div className="space-y-4">
            {reports.map((account) => {
              const statusConfig = getStatusConfig(account.status);
              
              return (
                <div key={account._id} className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl hover:bg-white/70 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    {/* Left Section - Profile & Info */}
                    <div className="flex items-center gap-4 flex-1">
                      <div className="relative">
                        <img
                          src={account.reportedUserProfileImage}
                          alt={account.reportedName}
                          className="w-16 h-16 rounded-full border-3 border-white shadow-md"
                        />
                        <div className={`absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                          account.userType === 'user' 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-purple-100 text-purple-700'
                        }`}>
                          {account.userType === 'user' ? <User className="w-3 h-3" /> : <Scale className="w-3 h-3" />}
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-gray-900 truncate">
                          {account.reportedName}
                        </h3>
                        <p className="text-sm text-gray-500 font-mono">
                          ID: {account.reportedId.slice(-8)}...
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-sm text-gray-600">
                            <span className="font-semibold text-red-600">{account.reportsCount}</span> reports
                          </span>
                          <span className="text-sm text-gray-500">•</span>
                          <span className="text-sm text-gray-600">
                            Latest: <span className="font-medium">{account.latestReportReason}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right Section - Status & Actions */}
                    <div className="flex items-center gap-4">
                      {/* Status Badge */}
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${statusConfig.textColor} ${statusConfig.bgColor}`}>
                        {statusConfig.icon}
                        {statusConfig.text}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => openModal(account)}
                          className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all duration-200 flex items-center gap-2 text-sm font-medium"
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </button>
                        <button onClick={()=>takeAction(account.reportedId,account.userType,account._id)} className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-200 flex items-center gap-2 text-sm font-medium">
                          <Shield className="w-4 h-4" />
                          Take Action
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          {reports.length === 0 && (
            <div className="text-center py-16">
              <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No reported accounts found
              </h3>
              <p className="text-gray-600">
                No accounts match your current filters. Try adjusting your search criteria.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Report Details Modal */}
      {isModalOpen && selectedAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={closeModal}
          />
          
          {/* Modal Content */}
          <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 w-full max-w-3xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
              <div className="flex items-center gap-4">
                <img
                  src={selectedAccount.reportedUserProfileImage}
                  alt={selectedAccount.reportedName}
                  className="w-12 h-12 rounded-full border-2 border-white shadow-md"
                />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Reports for {selectedAccount.reportedName}
                  </h2>
                  <p className="text-gray-600">
                    {selectedAccount.userType} • {selectedAccount.reportsCount} total reports
                  </p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-96">
              <div className="space-y-4">
                {selectedAccount.reports.map((report, index) => (
                  <div key={index} className="bg-white/50 backdrop-blur-sm rounded-2xl p-5 border border-gray-200/50">
                    {/* Report Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {report.reporterName}
                          </p>
                          <p className="text-xs text-gray-500">
                            Reporter ID: {report.reporterId.slice(-8)}...
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                          report.reason === 'Harassment' ? 'bg-red-100 text-red-700' :
                          report.reason === 'Fake Info' ? 'bg-orange-100 text-orange-700' :
                          report.reason === 'Scam' ? 'bg-purple-100 text-purple-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          <AlertCircle className="w-3 h-3" />
                          {report.reason}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {report.date}
                        </p>
                      </div>
                    </div>

                    {/* Report Description */}
                    <div className="bg-gray-50/70 rounded-xl p-4">
                      <p className="text-gray-700 leading-relaxed">
                        {report.description}
                      </p>
                    </div>

                    {/* Status Update */}
                    {/* <div className="flex items-center justify-between mt-4">
                      <span className="text-sm text-gray-600">Status:</span>
                      <select
                        value={report.status}
                        className="px-3 py-1 bg-white/70 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Reviewed">Reviewed</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </div> */}

                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            {/* <div className="flex items-center justify-between p-6 border-t border-gray-200/50 bg-gray-50/50">
              <button
                onClick={closeModal}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all duration-200 font-medium"
              >
                Close
              </button>
              <div className="flex gap-3">
                <button className="px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all duration-200 font-medium flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Mark as Resolved
                </button>
                <button className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-200 font-medium flex items-center gap-2">
                  <Ban className="w-4 h-4" />
                  Suspend Account
                </button>
              </div>
            </div> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportedAccountsPage;