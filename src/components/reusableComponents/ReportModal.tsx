import React, { useState } from 'react';
import { X, Upload } from 'lucide-react';
import { reportAccount } from '../../services/user/userService';
import { toast } from 'react-toastify';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportType: 'user' | 'lawyer';
  reportedId: string;
  reporterId: string;
}

const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  reportType,
  reportedId,
  reporterId

}) => {
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  const reasons = [
    'Harassment',
    'Spam',
    'Fake Profile',
    'Misconduct',
    'Fraud',
    'Other'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    reportAccount({
      reportedId: reportedId,
      userType: reportType == 'user' ? 'user' : 'lawyer',
      reason: reason,
      description: description,
      reporterId
    }).then((response) => {
      onClose();
      toast.success(response.data.message)
    })
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      console.log('Files uploaded:', files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files) {
      console.log('Files dropped:', files);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-[500px] bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Report {reportType === 'user' ? 'User' : 'Lawyer'}
            </h2>
            <p className="text-sm text-gray-600">
              Help us keep the platform safe by reporting inappropriate behavior.
            </p>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200 group"
          >
            <X className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Reason Dropdown */}
          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
              Reason for reporting
            </label>
            <select
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 hover:shadow-sm"
            >
              <option value="">Select a reason...</option>
              {reasons.map((reasonOption) => (
                <option key={reasonOption} value={reasonOption}>
                  {reasonOption}
                </option>
              ))}
            </select>
          </div>

          {/* Description Textarea */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please provide more details about the issue..."
              required
              className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 hover:shadow-sm resize-none"
            />
          </div>

          {/* File Upload */}
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Attachments (optional)
            </label>
            <div
              className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 hover:bg-gray-50/50 ${
                isDragOver
                  ? 'border-blue-400 bg-blue-50/50'
                  : 'border-gray-300'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                multiple
                accept="image/*,.pdf"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">
                Upload screenshots or proof (optional)
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Drag & drop files here or click to browse
              </p>
            </div>
          </div> */}

          {/* Footer Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!reason || !description}
              className="px-5 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-md hover:shadow-lg"
            >
              Submit Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportModal;