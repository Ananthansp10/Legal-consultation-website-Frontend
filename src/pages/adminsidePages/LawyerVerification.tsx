import React, { useEffect, useState } from 'react';
import { Eye, Download, Check, X, Search } from 'lucide-react';
import GlassCard from '../../components/admin/GlassCard';
import Button from '../../components/admin/Button';
import Modal from '../../components/admin/Modal';
import ConfirmationModal from '../../components/admin/ConfirmationModal';
import { unverifiedLawyersListing, verifyLawyer } from '../../services/admin/lawyerListingService';
import { toast } from 'react-toastify';
import { AxiosResponse } from 'axios';

interface Lawyer {
  _id: string;
  name: string;
  email: string;
  specialization: string[];
  barCouncilNumber: string;
  profileImage: string;
  documents: string[];
  verified: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

const LawyerVerification: React.FC = () => {
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLawyer, setSelectedLawyer] = useState<Lawyer | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; type: 'approve' | 'reject'; lawyer: Lawyer | null }>({ isOpen: false, type: 'approve', lawyer: null });
  const [rejectReasonModalOpen, setRejectReasonModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [previewModal, setPreviewModal] = useState<{ isOpen: boolean; url: string; type: 'pdf' | 'image' }>({ isOpen: false, url: '', type: 'image' });

  function fetchData() {

    unverifiedLawyersListing().then((response: AxiosResponse) => {
      setLawyers(response.data.data);
    });

  }

  useEffect(() => {
    fetchData()
  }, []);

  const filteredLawyers = lawyers.filter((lawyer) =>
    lawyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lawyer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApprove = (lawyer: Lawyer) => {
    setConfirmModal({ isOpen: true, type: 'approve', lawyer });
  };

  const handleReject = (lawyer: Lawyer) => {
    setRejectReason('');
    setConfirmModal({ isOpen: true, type: 'reject', lawyer });
  };

  const confirmAction = () => {
    if (confirmModal.type === 'reject') {
      setConfirmModal({ ...confirmModal, isOpen: false });
      setRejectReasonModalOpen(true);
    } else {
      setConfirmModal({ isOpen: false, type: 'approve', lawyer: null });
      verifyLawyer(confirmModal.lawyer?._id!, confirmModal.type, "null").then((response) => {
        toast.success(response.data.message)
        fetchData()
      }).catch((error) => {
        toast.error(error.response.data.message)
      })
    }
  };

  const submitRejection = () => {
    setRejectReasonModalOpen(false);
    setConfirmModal({ isOpen: false, type: 'reject', lawyer: null });
    verifyLawyer(confirmModal.lawyer?._id!, confirmModal.type, rejectReason).then((response) => {
      toast.success(response.data.message)
      fetchData()
    }).catch((error) => {
      toast.error(error.response.data.message)
    })
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Lawyer Verification</h1>
        <p className="text-slate-600 mt-2">Review and verify lawyer registrations with document preview.</p>
      </div>

      <GlassCard className="p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white/50 backdrop-blur-sm"
          />
        </div>
      </GlassCard>

      <GlassCard>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200/50">
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700">Lawyer</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700">Specialization</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700">Bar License</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700">Documents</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLawyers.map((lawyer) => (
                <tr key={lawyer._id} className="border-b border-slate-200/30 hover:bg-white/50">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <img src='https://tse3.mm.bing.net/th/id/OIP.3uQpGX34V3TU_BP195p9nQHaI1?pid=Api&P=0&h=180' alt={lawyer.name[0]} className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <p className="font-medium text-slate-800">{lawyer.name}</p>
                        <p className="text-sm text-slate-600">{lawyer.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-600">{lawyer.specialization[0]}</td>
                  <td className="py-4 px-6 text-sm text-slate-600">{lawyer.barCouncilNumber}</td>
                  <td className="py-4 px-6">
                    <Button variant="ghost" size="sm" icon={Eye} onClick={() => { setSelectedLawyer(lawyer); setViewModalOpen(true); }}>View Documents</Button>
                  </td>
                  <td className="py-4 px-6 space-x-2">
                    <Button variant="success" size="sm" icon={Check} onClick={() => handleApprove(lawyer)}>Approve</Button>
                    <Button variant="danger" size="sm" icon={X} onClick={() => handleReject(lawyer)}>Reject</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      <Modal isOpen={viewModalOpen} onClose={() => setViewModalOpen(false)} title={`Details - ${selectedLawyer?.name}`} size="xl">
        {selectedLawyer && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Name:</span> {selectedLawyer.name}</p>
                <p><span className="font-medium">Email:</span> {selectedLawyer.email}</p>
                <p><span className="font-medium">Specialization:</span> {selectedLawyer.specialization[0]}</p>
                <p><span className="font-medium">Bar License:</span> {selectedLawyer.barCouncilNumber}</p>
                <p><span className="font-medium">Status:</span> Not Verified</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-slate-800 mb-4">Uploaded Documents</h4>
              <div className="grid gap-4">
                {selectedLawyer.documents.map((url, index) => {
                  const isPdf = url.toLowerCase().endsWith('.pdf');
                  return (
                    <div key={index} className="border p-4 rounded-lg">
                      <div className="flex justify-between mb-2">
                        <h5 className="font-medium text-slate-800">Document {index + 1}</h5>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm" icon={Eye} onClick={() => setPreviewModal({ isOpen: true, url, type: isPdf ? 'pdf' : 'image' })}>Preview</Button>
                          <a href={url} target="_blank" download rel="noopener noreferrer">
                            <Button variant="ghost" size="sm" icon={Download}>Download</Button>
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={previewModal.isOpen} onClose={() => setPreviewModal({ ...previewModal, isOpen: false })} title="Document Preview">
        {previewModal.type === 'pdf' ? (
          <iframe src={previewModal.url} className="w-full h-96" />
        ) : (
          <div className="flex justify-center items-center min-h-[500px]">
            <img
              src={previewModal.url}
              alt="Preview"
              className="max-w-full max-h-[80vh] mx-auto rounded shadow-lg object-contain"
            />
          </div>
        )}
      </Modal>

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, type: 'approve', lawyer: null })}
        onConfirm={confirmAction}
        type={confirmModal.type}
        title={`${confirmModal.type === 'approve' ? 'Approve' : 'Reject'} Lawyer`}
        message={`Are you sure you want to ${confirmModal.type} ${confirmModal.lawyer?.name}?`}
      />

      <Modal isOpen={rejectReasonModalOpen} onClose={() => setRejectReasonModalOpen(false)} title="Rejection Reason">
        <textarea
          className="w-full p-3 border rounded-lg text-sm"
          rows={4}
          placeholder="Enter reason for rejection..."
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
        />
        <div className="flex justify-end mt-4">
          <Button variant="danger" onClick={submitRejection}>Submit</Button>
        </div>
      </Modal>
    </div>
  );
};

export default LawyerVerification;
