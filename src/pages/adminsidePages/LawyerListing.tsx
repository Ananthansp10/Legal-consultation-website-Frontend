import React, { useEffect, useState } from 'react';
import {
  Eye,
  Search,
  Filter,
  UserCheck,
  Ban,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import GlassCard from '../../components/admin/GlassCard';
import Button from '../../components/admin/Button';
import Modal from '../../components/admin/Modal';
import Badge from '../../components/admin/Badge';
import ConfirmationModal from '../../components/admin/ConfirmationModal';
import { getLawyers, updateLawyerStatus } from '../../services/admin/lawyerListingService';
import { toast } from 'react-toastify';

interface Lawyer {
  _id: string;
  name: string;
  email: string;
  specialization: string[];
  experience: string;
  barCouncilNumber: string;
  documents: string[];
  isBlock: boolean;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
  profileImage?: string;
}

const LawyerListing: React.FC = () => {
  const [selectedLawyer, setSelectedLawyer] = useState<Lawyer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean;
    type: 'block' | 'unblock';
    lawyer: Lawyer | null;
  }>({ isOpen: false, type: 'block', lawyer: null });
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [lawyers,setLawyers]=useState<Lawyer[]>([])

  const dummyImage = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

  function fetchLawyer(){
    getLawyers().then((response)=>{
      setLawyers(response.data.data)
    })
  }

  useEffect(()=>{
    fetchLawyer()
  },[])

  const filteredLawyers = lawyers.filter((lawyer) => {
    const statusMatch =
      filter === 'all' ||
      (filter === 'active' && !lawyer.isBlock) ||
      (filter === 'inactive' && lawyer.isBlock);

    const searchMatch =
      lawyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lawyer.email.toLowerCase().includes(searchTerm.toLowerCase());

    return statusMatch && searchMatch;
  });

  const totalPages = Math.ceil(filteredLawyers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLawyers = filteredLawyers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const getStatusBadge = (isBlocked: boolean) => {
    return isBlocked ? (
      <Badge variant="danger">Inactive</Badge>
    ) : (
      <Badge variant="success">Active</Badge>
    );
  };

  const handleViewProfile = (lawyer: Lawyer) => {
    setSelectedLawyer(lawyer);
    setIsModalOpen(true);
  };

  const handleToggleStatusClick = (lawyer: Lawyer) => {
    setConfirmationModal({
      isOpen: true,
      type: lawyer.isBlock ? 'unblock' : 'block',
      lawyer,
    });
  };

  const handleConfirmAction = async () => {
    if (!confirmationModal.lawyer) return;

    setIsLoading(true);
    
    updateLawyerStatus(confirmationModal.lawyer._id,confirmationModal.type).then((response)=>{
      toast.success(response.data.message)
      fetchLawyer()
    }).catch((error)=>{
      toast.error(error.response.data.message)
    })

    setIsLoading(false);
    setConfirmationModal({ isOpen: false, type: 'block', lawyer: null });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Lawyer Management</h1>
        <p className="text-slate-600 mt-2">
          View, search, filter, and manage all registered lawyers.
        </p>
      </div>

      <GlassCard className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or email..."
              className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white/50 backdrop-blur-sm"
            />
          </div>
          <div className="flex items-center space-x-3">
            <Filter className="text-slate-400" />
            <select
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white/50 backdrop-blur-sm"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </GlassCard>

      <GlassCard>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200/50">
                <th className="text-left px-6 py-4">Lawyer</th>
                <th className="text-left px-6 py-4">Specialization</th>
                <th className="text-left px-6 py-4">Email</th>
                <th className="text-left px-6 py-4">Status</th>
                <th className="text-left px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedLawyers.map((lawyer) => (
                <tr key={lawyer._id} className="border-b border-slate-200/30">
                  <td className="px-6 py-4 flex items-center space-x-3">
                    <img
                      src={lawyer.profileImage || dummyImage}
                      alt={lawyer.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <span>{lawyer.name}</span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {lawyer.specialization.join(', ')}
                  </td>
                  <td className="px-6 py-4 text-sm">{lawyer.email}</td>
                  <td className="px-6 py-4">{getStatusBadge(lawyer.isBlock)}</td>
                  <td className="px-6 py-4">
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
                        variant={lawyer.isBlock ? 'success' : 'danger'}
                        size="sm"
                        icon={lawyer.isBlock ? UserCheck : Ban}
                        onClick={() => handleToggleStatusClick(lawyer)}
                      >
                        {lawyer.isBlock ? 'Unblock' : 'Block'}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      <GlassCard className="p-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-600">
            Showing {startIndex + 1}–{Math.min(startIndex + itemsPerPage, filteredLawyers.length)} of{' '}
            {filteredLawyers.length}
          </span>
          <div className="flex items-center space-x-2">
            <Button
              icon={ChevronLeft}
              variant="ghost"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            >
              Prev
            </Button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === i + 1
                    ? 'bg-blue-500 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <Button
              icon={ChevronRight}
              variant="ghost"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            >
              Next
            </Button>
          </div>
        </div>
      </GlassCard>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Lawyer Profile - ${selectedLawyer?.name}`}
      >
        {selectedLawyer && (
          <div className="space-y-4">
            <img
              src={selectedLawyer.profileImage || dummyImage}
              alt={selectedLawyer.name}
              className="w-24 h-24 rounded-full object-cover mx-auto"
            />
            <div className="text-center">
              <h2 className="text-lg font-semibold">{selectedLawyer.name}</h2>
              <p className="text-slate-600">{selectedLawyer.specialization.join(', ')}</p>
              {getStatusBadge(selectedLawyer.isBlock)}
            </div>
            <div className="space-y-2 text-sm">
              <p>Email: {selectedLawyer.email}</p>
              <p>Experience: {selectedLawyer.experience}</p>
              <p>Bar Council No: {selectedLawyer.barCouncilNumber}</p>
              <p>Joined: {new Date(selectedLawyer.createdAt).toDateString()}</p>
            </div>
            <div className="flex justify-end">
              <Button
                variant={selectedLawyer.isBlock ? 'success' : 'danger'}
                onClick={() => handleToggleStatusClick(selectedLawyer)}
              >
                {selectedLawyer.isBlock ? 'Unblock' : 'Block'}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={() =>
          setConfirmationModal({ isOpen: false, type: 'block', lawyer: null })
        }
        onConfirm={handleConfirmAction}
        type={confirmationModal.type}
        title={
          confirmationModal.type === 'block' ? 'Block Lawyer' : 'Unblock Lawyer'
        }
        message={
          confirmationModal.lawyer
            ? `Are you sure you want to ${
                confirmationModal.type === 'block' ? 'block' : 'unblock'
              } ${confirmationModal.lawyer.name}?`
            : ''
        }
        isLoading={isLoading}
      />
    </div>
  );
};

export default LawyerListing;
