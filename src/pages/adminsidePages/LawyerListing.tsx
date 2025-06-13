import React, { useState } from 'react';
import { Eye, Search, Filter, UserCheck, Ban, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import GlassCard from '../../components/admin/GlassCard';
import Button from '../../components/admin/Button';
import Modal from '../../components/admin/Modal';
import Badge from '../../components/admin/Badge';
import ConfirmationModal from '../../components/admin/ConfirmationModal';

interface Lawyer {
  id: number;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  profileImage: string;
  status: 'verified' | 'blocked' | 'pending';
  rating: number;
  consultations: number;
  joinedDate: string;
}

const LawyerListing: React.FC = () => {
  const [selectedLawyer, setSelectedLawyer] = useState<Lawyer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean;
    type: 'block' | 'unblock' | 'delete';
    lawyer: Lawyer | null;
  }>({ isOpen: false, type: 'block', lawyer: null });
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data
  const lawyers: Lawyer[] = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+1 (555) 123-4567',
      specialization: 'Corporate Law',
      profileImage: 'https://images.pexels.com/photos/5490276/pexels-photo-5490276.jpeg?auto=compress&cs=tinysrgb&w=400',
      status: 'verified',
      rating: 4.9,
      consultations: 145,
      joinedDate: '2023-01-15',
    },
    {
      id: 2,
      name: 'John Martinez',
      email: 'john.martinez@email.com',
      phone: '+1 (555) 234-5678',
      specialization: 'Criminal Law',
      profileImage: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400',
      status: 'verified',
      rating: 4.8,
      consultations: 128,
      joinedDate: '2023-02-20',
    },
    {
      id: 3,
      name: 'Emily Chen',
      email: 'emily.chen@email.com',
      phone: '+1 (555) 345-6789',
      specialization: 'Family Law',
      profileImage: 'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=400',
      status: 'blocked',
      rating: 4.7,
      consultations: 98,
      joinedDate: '2023-03-10',
    },
    {
      id: 4,
      name: 'Michael Rodriguez',
      email: 'michael.rodriguez@email.com',
      phone: '+1 (555) 456-7890',
      specialization: 'Real Estate Law',
      profileImage: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=400',
      status: 'verified',
      rating: 4.6,
      consultations: 87,
      joinedDate: '2023-04-05',
    },
    {
      id: 5,
      name: 'Lisa Thompson',
      email: 'lisa.thompson@email.com',
      phone: '+1 (555) 567-8901',
      specialization: 'Immigration Law',
      profileImage: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400',
      status: 'pending',
      rating: 4.5,
      consultations: 76,
      joinedDate: '2023-05-12',
    },
  ];

  const filteredLawyers = lawyers.filter(lawyer => {
    const matchesFilter = filter === 'all' || lawyer.status === filter;
    const matchesSearch = lawyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lawyer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lawyer.phone.includes(searchTerm);
    return matchesFilter && matchesSearch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredLawyers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLawyers = filteredLawyers.slice(startIndex, startIndex + itemsPerPage);

  const handleViewProfile = (lawyer: Lawyer) => {
    setSelectedLawyer(lawyer);
    setIsModalOpen(true);
  };

  const handleToggleStatusClick = (lawyer: Lawyer) => {
    setConfirmationModal({
      isOpen: true,
      type: lawyer.status === 'verified' ? 'block' : 'unblock',
      lawyer: lawyer
    });
  };

  const handleDeleteClick = (lawyer: Lawyer) => {
    setConfirmationModal({
      isOpen: true,
      type: 'delete',
      lawyer: lawyer
    });
  };

  const handleConfirmAction = async () => {
    if (!confirmationModal.lawyer) return;
    
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log(`${confirmationModal.type} lawyer:`, confirmationModal.lawyer.id);
    
    setIsLoading(false);
    setConfirmationModal({ isOpen: false, type: 'block', lawyer: null });
    setIsModalOpen(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge variant="success">Verified</Badge>;
      case 'blocked':
        return <Badge variant="danger">Blocked</Badge>;
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const getConfirmationMessage = () => {
    if (!confirmationModal.lawyer) return '';
    
    switch (confirmationModal.type) {
      case 'block':
        return `Are you sure you want to block ${confirmationModal.lawyer.name}? They will no longer be able to access the platform.`;
      case 'unblock':
        return `Are you sure you want to unblock ${confirmationModal.lawyer.name}? They will regain access to the platform.`;
      case 'delete':
        return `Are you sure you want to permanently delete ${confirmationModal.lawyer.name}? This action cannot be undone.`;
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Lawyer Management</h1>
        <p className="text-slate-600 mt-2">View, search, filter, and manage all registered lawyers.</p>
      </div>

      {/* Filters and Search */}
      <GlassCard className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-slate-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
              >
                <option value="all">All Status</option>
                <option value="verified">Verified</option>
                <option value="blocked">Blocked</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
            >
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
            </select>
          </div>
        </div>
      </GlassCard>

      {/* Lawyers Table */}
      <GlassCard>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200/50">
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700">Lawyer</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700">Specialization</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700">Contact</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700">Status</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700">Rating</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedLawyers.map((lawyer) => (
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
                        <p className="text-sm text-slate-600">{lawyer.consultations} consultations</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-600">{lawyer.specialization}</td>
                  <td className="py-4 px-6">
                    <div className="text-sm">
                      <p className="text-slate-800">{lawyer.email}</p>
                      <p className="text-slate-600">{lawyer.phone}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">{getStatusBadge(lawyer.status)}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-1">
                      <span className="text-yellow-500">★</span>
                      <span className="text-sm font-medium text-slate-800">{lawyer.rating}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={Eye}
                        onClick={() => handleViewProfile(lawyer)}
                      >
                        View
                      </Button>
                      <Button
                        variant={lawyer.status === 'verified' ? 'danger' : 'success'}
                        size="sm"
                        icon={lawyer.status === 'verified' ? Ban : UserCheck}
                        onClick={() => handleToggleStatusClick(lawyer)}
                      >
                        {lawyer.status === 'verified' ? 'Block' : 'Verify'}
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        icon={Trash2}
                        onClick={() => handleDeleteClick(lawyer)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Pagination */}
      <GlassCard className="p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-600">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredLawyers.length)} of {filteredLawyers.length} lawyers
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              icon={ChevronLeft}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 text-sm rounded-lg transition-colors duration-200 ${
                  currentPage === page
                    ? 'bg-blue-500 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {page}
              </button>
            ))}
            <Button
              variant="ghost"
              size="sm"
              icon={ChevronRight}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </GlassCard>

      {/* Profile Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Lawyer Profile - ${selectedLawyer?.name}`}
        size="lg"
      >
        {selectedLawyer && (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <img
                src={selectedLawyer.profileImage}
                alt={selectedLawyer.name}
                className="w-20 h-20 rounded-full object-cover"
              />
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-slate-800">{selectedLawyer.name}</h3>
                <p className="text-slate-600">{selectedLawyer.specialization}</p>
                <div className="flex items-center space-x-4 mt-2">
                  {getStatusBadge(selectedLawyer.status)}
                  <div className="flex items-center space-x-1">
                    <span className="text-yellow-500">★</span>
                    <span className="text-sm font-medium">{selectedLawyer.rating}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-slate-800 mb-3">Contact Information</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Email:</span> {selectedLawyer.email}</p>
                  <p><span className="font-medium">Phone:</span> {selectedLawyer.phone}</p>
                  <p><span className="font-medium">Joined:</span> {selectedLawyer.joinedDate}</p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-slate-800 mb-3">Statistics</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Total Consultations:</span> {selectedLawyer.consultations}</p>
                  <p><span className="font-medium">Rating:</span> {selectedLawyer.rating}/5.0</p>
                  <p><span className="font-medium">Status:</span> {selectedLawyer.status}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
              <Button
                variant={selectedLawyer.status === 'verified' ? 'danger' : 'success'}
                onClick={() => handleToggleStatusClick(selectedLawyer)}
              >
                {selectedLawyer.status === 'verified' ? 'Block Lawyer' : 'Verify Lawyer'}
              </Button>
              <Button
                variant="danger"
                onClick={() => handleDeleteClick(selectedLawyer)}
              >
                Delete Lawyer
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={() => setConfirmationModal({ isOpen: false, type: 'block', lawyer: null })}
        onConfirm={handleConfirmAction}
        type={confirmationModal.type}
        title={`${confirmationModal.type === 'block' ? 'Block' : confirmationModal.type === 'unblock' ? 'Unblock' : 'Delete'} Lawyer`}
        message={getConfirmationMessage()}
        isLoading={isLoading}
      />

      {/* Empty State */}
      {filteredLawyers.length === 0 && (
        <GlassCard className="p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserCheck className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">No lawyers found</h3>
            <p className="text-slate-600">
              {searchTerm || filter !== 'all' 
                ? 'No lawyers match your current filters. Try adjusting your search criteria.'
                : 'No lawyers have been registered yet.'
              }
            </p>
          </div>
        </GlassCard>
      )}
    </div>
  );
};

export default LawyerListing;