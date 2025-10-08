import React from "react";
import { Save, Check, Sparkles, Zap } from "lucide-react";

interface SaveButtonProps {
  onSave: () => void;
  disabled?: boolean;
}

const SaveButton: React.FC<SaveButtonProps> = ({ onSave, disabled }) => {
  const [isSaving, setIsSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  const handleSave = async () => {
    if (disabled) return;

    setIsSaving(true);

    // Simulate save action
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSaving(false);
    setSaved(true);
    onSave();

    // Reset saved state after 3 seconds
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50">
      <div className="relative group">
        {/* Floating glow effect */}
        <div
          className={`absolute -inset-4 rounded-full blur-2xl transition-all duration-500 ${
            disabled || isSaving
              ? "bg-gray-400/20"
              : saved
                ? "bg-gradient-to-r from-emerald-400 to-green-500 opacity-60 animate-pulse"
                : "bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 opacity-40 group-hover:opacity-60"
          }`}
        ></div>

        {/* Main button */}
        <button
          onClick={handleSave}
          disabled={disabled || isSaving}
          className={`
            relative inline-flex items-center justify-center px-8 py-4 rounded-full text-white font-bold text-lg
            backdrop-blur-xl shadow-2xl transition-all duration-500 transform overflow-hidden
            ${
              disabled || isSaving
                ? "bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed scale-95"
                : saved
                  ? "bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 shadow-emerald-500/40 scale-110"
                  : "bg-gradient-to-r from-blue-500 via-purple-600 to-blue-700 hover:from-blue-600 hover:via-purple-700 hover:to-blue-800 shadow-blue-500/40 hover:scale-110 hover:shadow-3xl"
            }
          `}
        >
          {/* Animated background shimmer */}
          {!disabled && !isSaving && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          )}

          {/* Sparkle effects for saved state */}
          {saved && (
            <>
              <div className="absolute top-1 right-2 animate-ping">
                <Sparkles className="w-3 h-3 text-white/80" />
              </div>
              <div className="absolute bottom-1 left-2 animate-pulse delay-300">
                <Zap className="w-3 h-3 text-white/60" />
              </div>
            </>
          )}

          <div className="relative flex items-center space-x-3">
            {isSaving ? (
              <>
                <div className="relative">
                  <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <div className="absolute inset-0 w-6 h-6 border-3 border-transparent border-t-blue-200 rounded-full animate-spin animate-reverse"></div>
                </div>
                <span className="animate-pulse">Saving...</span>
              </>
            ) : saved ? (
              <>
                <div className="relative">
                  <Check className="w-6 h-6 animate-bounce" />
                  <div className="absolute inset-0 w-6 h-6 bg-white/20 rounded-full animate-ping"></div>
                </div>
                <span>Saved Successfully!</span>
              </>
            ) : (
              <>
                <Save className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                <span>Save Availability</span>
              </>
            )}
          </div>

          {/* Ripple effect on click */}
          <div className="absolute inset-0 rounded-full opacity-0 group-active:opacity-100 bg-white/20 animate-ping"></div>
        </button>

        {/* Floating particles around button */}
        {!disabled && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-2 -right-2 w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-100 opacity-60"></div>
            <div className="absolute -bottom-2 -left-2 w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce delay-300 opacity-60"></div>
            <div className="absolute top-1/2 -left-4 w-1 h-1 bg-cyan-400 rounded-full animate-pulse delay-500 opacity-60"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SaveButton;
