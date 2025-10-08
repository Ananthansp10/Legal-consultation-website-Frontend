import React from "react";
import { AlertTriangle, Check, X } from "lucide-react";
import Modal from "../../components/admin/Modal";
import Button from "./Button";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  type?: "approve" | "reject" | "block" | "unblock" | "delete" | "default";
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = "default",
  confirmText,
  cancelText = "Cancel",
  isLoading = false,
}) => {
  const getTypeConfig = () => {
    switch (type) {
      case "approve":
        return {
          icon: Check,
          iconColor: "text-green-500",
          iconBg: "bg-green-100",
          confirmVariant: "success" as const,
          defaultConfirmText: "Approve",
        };
      case "reject":
        return {
          icon: X,
          iconColor: "text-red-500",
          iconBg: "bg-red-100",
          confirmVariant: "danger" as const,
          defaultConfirmText: "Reject",
        };
      case "block":
        return {
          icon: X,
          iconColor: "text-red-500",
          iconBg: "bg-red-100",
          confirmVariant: "danger" as const,
          defaultConfirmText: "Block",
        };
      case "unblock":
        return {
          icon: Check,
          iconColor: "text-green-500",
          iconBg: "bg-green-100",
          confirmVariant: "success" as const,
          defaultConfirmText: "Unblock",
        };
      case "delete":
        return {
          icon: AlertTriangle,
          iconColor: "text-red-500",
          iconBg: "bg-red-100",
          confirmVariant: "danger" as const,
          defaultConfirmText: "Delete",
        };
      default:
        return {
          icon: AlertTriangle,
          iconColor: "text-yellow-500",
          iconBg: "bg-yellow-100",
          confirmVariant: "primary" as const,
          defaultConfirmText: "Confirm",
        };
    }
  };

  const config = getTypeConfig();
  const Icon = config.icon;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="text-center">
        <div
          className={`w-16 h-16 ${config.iconBg} rounded-full flex items-center justify-center mx-auto mb-4`}
        >
          <Icon className={`w-8 h-8 ${config.iconColor}`} />
        </div>

        <p className="text-slate-600 mb-6 leading-relaxed">{message}</p>

        <div className="flex justify-center space-x-3">
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            {cancelText}
          </Button>
          <Button
            variant={config.confirmVariant}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading
              ? "Processing..."
              : confirmText || config.defaultConfirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
