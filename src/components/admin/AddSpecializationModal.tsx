import React, { useState } from "react";
import { X, Save, Sparkles } from "lucide-react";
import { addSpecialization } from "../../services/admin/adminService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

interface AddSpecializationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddSpecializationModal: React.FC<AddSpecializationModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  function submitDetails(e: React.FormEvent) {
    e.preventDefault();
    addSpecialization({
      name: name,
      description: description,
      isDeleted: false,
    })
      .then((response) => {
        toast.success(response.data.message);
        onClose();
        navigate("/admin-dashboard/specialization");
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-slate-900/20 via-blue-900/10 to-purple-900/20 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl w-full max-w-lg border border-white/20 animate-in fade-in zoom-in duration-500 overflow-hidden">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-white/50 to-purple-50/30" />

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between p-8 border-b border-white/20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Add Specialization
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-3 rounded-xl hover:bg-white/50 transition-all duration-200 hover:scale-110"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Form */}
        <div className="relative z-10 p-8 space-y-8">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3 tracking-wide uppercase">
              Specialization Name
            </label>
            <input
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setName(e.target.value)
              }
              type="text"
              placeholder="Eg: Corporate Law"
              className="w-full px-6 py-4 rounded-2xl border border-white/30 focus:border-blue-400 focus:ring-4 focus:ring-blue-100/50 transition-all duration-300 bg-white/60 backdrop-blur-sm text-slate-800 font-medium placeholder:text-slate-400 hover:bg-white/70 focus:bg-white/80"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3 tracking-wide uppercase">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setDescription(e.target.value)
              }
              rows={5}
              placeholder="Brief description of the specialization"
              className="w-full px-6 py-4 rounded-2xl border border-white/30 focus:border-blue-400 focus:ring-4 focus:ring-blue-100/50 transition-all duration-300 resize-none bg-white/60 backdrop-blur-sm text-slate-800 font-medium placeholder:text-slate-400 hover:bg-white/70 focus:bg-white/80"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="relative z-10 flex gap-4 p-8 border-t border-white/20">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-4 rounded-2xl border border-white/30 text-slate-600 hover:bg-white/50 transition-all duration-200 font-semibold backdrop-blur-sm hover:scale-105"
          >
            Cancel
          </button>
          <button
            onClick={(e) => submitDetails(e)}
            className="group relative flex-1 px-6 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white hover:from-blue-700 hover:via-blue-600 hover:to-indigo-700 hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 font-semibold flex items-center justify-center gap-3 hover:scale-105 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            <Save className="w-4 h-4" />
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddSpecializationModal;
