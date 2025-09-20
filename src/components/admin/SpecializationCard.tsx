import React, { useState } from 'react';
import { Edit3, Trash2, Scale, X } from 'lucide-react';
import { deleteSpecialization, editSpecialization } from '../../services/admin/adminService';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import { ErrorResponse } from '../../interface/errorInterface';
import ConfirmModal from '../reusableComponents/ConfirmModal';

interface SpecializationCardProps {
  specId: string
  name: string;
  description: string;
  handleChange: Function;
}

const SpecializationCard: React.FC<SpecializationCardProps> = ({ specId, name, description, handleChange }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState(name);
  const [editDescription, setEditDescription] = useState(description);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)

  function removeSpecialization(specId: string) {
    deleteSpecialization(specId).then((response) => {
      toast.success(response.data.message)
      handleChange()
    }).catch((error) => {
      const errorResponse = error as AxiosError<ErrorResponse>
      const errorData = errorResponse.response?.data
      toast.error(errorData?.message)
    })
  }

  const handleEditSubmit = () => {
    setIsEditModalOpen(false);
    editSpecialization({ specId: specId, name: editName, description: editDescription, isDeleted: false }).then((response) => {
      toast.success(response.data.message)
      handleChange()
    }).catch((error) => {
      const errorResponse = error as AxiosError<ErrorResponse>
      const errorData = errorResponse.response?.data
      toast.error(errorData?.message)
    })
  };

  const openEditModal = () => {
    setEditName(name);
    setEditDescription(description);
    setIsEditModalOpen(true);
  };

  return (
    <>
      <div className="group relative bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:shadow-2xl hover:shadow-blue-500/10 hover:scale-[1.03] transition-all duration-500 hover:border-blue-300/30 overflow-hidden">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Content */}
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 group-hover:from-blue-200 group-hover:to-indigo-200 transition-all duration-300">
                <Scale className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent group-hover:from-slate-900 group-hover:to-slate-700 transition-all duration-300">
                {name}
              </h3>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
              <button onClick={openEditModal} className="p-3 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 hover:from-blue-100 hover:to-blue-200 hover:scale-110 transition-all duration-200 shadow-lg hover:shadow-blue-200/50 border border-blue-200/50">
                <Edit3 className="w-4 h-4" />
              </button>
              <button onClick={() => setIsConfirmOpen(true)} className="p-3 rounded-xl bg-gradient-to-br from-red-50 to-red-100 text-red-600 hover:from-red-100 hover:to-red-200 hover:scale-110 transition-all duration-200 shadow-lg hover:shadow-red-200/50 border border-red-200/50">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          <p className="text-slate-600 leading-relaxed text-base font-medium group-hover:text-slate-700 transition-colors duration-300">
            {description}
          </p>

          {/* Bottom accent line */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-full" />
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full border border-white/20 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Edit Specialization
              </h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 text-gray-600 hover:from-gray-100 hover:to-gray-200 hover:scale-110 transition-all duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Specialization Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all duration-200 bg-white/70 backdrop-blur-sm"
                  placeholder="Enter specialization name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description
                </label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all duration-200 bg-white/70 backdrop-blur-sm resize-none"
                  placeholder="Enter description"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 text-gray-700 hover:from-gray-100 hover:to-gray-200 transition-all duration-200 font-medium border border-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSubmit}
                className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 hover:scale-105 transition-all duration-200 font-medium shadow-lg hover:shadow-blue-200/50"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
      {isConfirmOpen && (
        <ConfirmModal
          title="Delete Specialization"
          message="Are you sure you want to delete this specialization? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={() => {
            removeSpecialization(specId);
            setIsConfirmOpen(false);
          }}
          onCancel={() => setIsConfirmOpen(false)}
        />
      )}
    </>
  );
};

export default SpecializationCard;