import React, { useState } from 'react';
import { Eye, Download, Check, X, Filter, Search } from 'lucide-react';
import GlassCard from '../../components/admin/GlassCard';
import Button from '../../components/admin/Button';
import Modal from '../../components/admin/Modal';
import Badge from '../../components/admin/Badge';
import ConfirmationModal from '../../components/admin/ConfirmationModal';

interface Lawyer {
  id: number;
  name: string;
  email: string;
  specialization: string;
  barLicense: string;
  profileImage: string;
  documents: {
    name: string;
    url: string;
    type: 'pdf' | 'image';
  }[];
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

const LawyerVerification: React.FC = () => {
  const [selectedLawyer, setSelectedLawyer] = useState<Lawyer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean;
    type: 'approve' | 'reject';
    lawyer: Lawyer | null;
  }>({ isOpen: false, type: 'approve', lawyer: null });
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Mock data
  const lawyers: Lawyer[] = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@email.com',
      specialization: 'Corporate Law',
      barLicense: 'BL-2023-001',
      profileImage: 'https://images.pexels.com/photos/5490276/pexels-photo-5490276.jpeg?auto=compress&cs=tinysrgb&w=400',
      documents: [
        { name: 'Bar Certificate', url: '/documents/bar-cert-1.pdf', type: 'pdf' },
        { name: 'Law Degree', url: '/documents/degree-1.pdf', type: 'pdf' },
      ],
      status: 'pending',
      submittedAt: '2024-01-15',
    },
    {
      id: 2,
      name: 'John Martinez',
      email: 'john.martinez@email.com',
      specialization: 'Criminal Law',
      barLicense: 'BL-2023-002',
      profileImage: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400',
      documents: [
        { name: 'Bar Certificate', url: '/documents/bar-cert-2.pdf', type: 'pdf' },
        { name: 'Law Degree', url: '/documents/degree-2.pdf', type: 'pdf' },
      ],
      status: 'pending',
      submittedAt: '2024-01-14',
    },
    {
      id: 3,
      name: 'Emily Chen',
      email: 'emily.chen@email.com',
      specialization: 'Family Law',
      barLicense: 'BL-2023-003',
      profileImage: 'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=400',
      documents: [
        { name: 'Bar Certificate', url: '/documents/bar-cert-3.pdf', type: 'pdf' },
        { name: 'Law Degree', url: '/documents/degree-3.pdf', type: 'pdf' },
      ],
      status: 'approved',
      submittedAt: '2024-01-13',
    },
  ];

  const filteredLawyers = lawyers.filter(lawyer => {
    const matchesFilter = filter === 'all' || lawyer.status === filter;
    const matchesSearch = lawyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lawyer.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleViewDocuments = (lawyer: Lawyer) => {
    setSelectedLawyer(lawyer);
    setIsModalOpen(true);
  };

  const handleApproveClick = (lawyer: Lawyer) => {
    setConfirmationModal({
      isOpen: true,
      type: 'approve',
      lawyer: lawyer
    });
  };

  const handleRejectClick = (lawyer: Lawyer) => {
    setConfirmationModal({
      isOpen: true,
      type: 'reject',
      lawyer: lawyer
    });
  };

  const handleConfirmAction = async () => {
    if (!confirmationModal.lawyer) return;
    
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log(`${confirmationModal.type === 'approve' ? 'Approved' : 'Rejected'} lawyer:`, confirmationModal.lawyer.id);
    
    setIsLoading(false);
    setConfirmationModal({ isOpen: false, type: 'approve', lawyer: null });
    setIsModalOpen(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'approved':
        return <Badge variant="success">Approved</Badge>;
      case 'rejected':
        return <Badge variant="danger">Rejected</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Lawyer Verification</h1>
        <p className="text-slate-600 mt-2">Review and verify lawyer registrations with document preview.</p>
      </div>

      {/* Filters and Search */}
      <GlassCard className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-slate-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </GlassCard>

      {/* Verification Table */}
      <GlassCard>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200/50">
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700">Lawyer</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700">Specialization</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700">Bar License</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700">Documents</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700">Status</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLawyers.map((lawyer) => (
                <tr
                  key={lawyer.id}
                  className="border-b border-slate-200/30 hover:bg-white/50 transition-colors duration-200"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <img
                        src={lawyer.profileImage}
                        alt={lawyer.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium text-slate-800">{lawyer.name}</p>
                        <p className="text-sm text-slate-600">{lawyer.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-600">{lawyer.specialization}</td>
                  <td className="py-4 px-6 text-sm text-slate-600">{lawyer.barLicense}</td>
                  <td className="py-4 px-6">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={Eye}
                      onClick={() => handleViewDocuments(lawyer)}
                    >
                      View Documents
                    </Button>
                  </td>
                  <td className="py-4 px-6">{getStatusBadge(lawyer.status)}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      {lawyer.status === 'pending' && (
                        <>
                          <Button
                            variant="success"
                            size="sm"
                            icon={Check}
                            onClick={() => handleApproveClick(lawyer)}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            icon={X}
                            onClick={() => handleRejectClick(lawyer)}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Document Viewer Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Documents - ${selectedLawyer?.name}`}
        size="xl"
      >
        {selectedLawyer && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-slate-800 mb-2">Lawyer Information</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Name:</span> {selectedLawyer.name}</p>
                  <p><span className="font-medium">Email:</span> {selectedLawyer.email}</p>
                  <p><span className="font-medium">Specialization:</span> {selectedLawyer.specialization}</p>
                  <p><span className="font-medium">Bar License:</span> {selectedLawyer.barLicense}</p>
                  <p><span className="font-medium">Submitted:</span> {selectedLawyer.submittedAt}</p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-slate-800 mb-2">Status</h4>
                {getStatusBadge(selectedLawyer.status)}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-slate-800 mb-4">Uploaded Documents</h4>
              <div className="space-y-4">
                {selectedLawyer.documents.map((doc, index) => (
                  <div key={index} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-slate-800">{doc.name}</h5>
                      <Button variant="ghost" size="sm" icon={Download}>
                        Download
                      </Button>
                    </div>
                    <div className="bg-slate-100 rounded-lg p-4 text-center">
                      {doc.type === 'pdf' ? (
                        <div className="space-y-2">
                          <div className="w-16 h-20 bg-red-500 rounded mx-auto flex items-center justify-center">
                            <span className="text-white font-bold text-xs">PDF</span>
                          </div>
                          <p className="text-sm text-slate-600">PDF Document Preview</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="w-20 h-20 bg-blue-500 rounded mx-auto flex items-center justify-center">
                            <span className="text-white font-bold text-xs">IMG</span>
                          </div>
                          <p className="text-sm text-slate-600">Image Preview</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {selectedLawyer.status === 'pending' && (
              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
                <Button
                  variant="danger"
                  onClick={() => handleRejectClick(selectedLawyer)}
                >
                  Reject
                </Button>
                <Button
                  variant="success"
                  onClick={() => handleApproveClick(selectedLawyer)}
                >
                  Approve
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={() => setConfirmationModal({ isOpen: false, type: 'approve', lawyer: null })}
        onConfirm={handleConfirmAction}
        type={confirmationModal.type}
        title={`${confirmationModal.type === 'approve' ? 'Approve' : 'Reject'} Lawyer`}
        message={`Are you sure you want to ${confirmationModal.type} ${confirmationModal.lawyer?.name}? This action will ${confirmationModal.type === 'approve' ? 'grant them access to the platform' : 'deny their application'}.`}
        isLoading={isLoading}
      />

      {/* Empty State */}
      {filteredLawyers.length === 0 && (
        <GlassCard className="p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Eye className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">No lawyers found</h3>
            <p className="text-slate-600">
              {searchTerm || filter !== 'all' 
                ? 'No lawyers match your current filters. Try adjusting your search criteria.'
                : 'No pending lawyer verifications right now.'
              }
            </p>
          </div>
        </GlassCard>
      )}
    </div>
  );
};

export default LawyerVerification;