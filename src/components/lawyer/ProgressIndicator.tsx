 import React from 'react';
import { Check } from 'lucide-react';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ currentStep, totalSteps }) => {
  const steps = [
    { number: 1, title: 'Basic Info' },
    { number: 2, title: 'Professional' },
    { number: 3, title: 'Documents' }
  ];

  return (
    <div className="flex items-center justify-center space-x-4">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          {/* Step Circle */}
          <div className="relative">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm transition-all duration-300 ${
                step.number < currentStep
                  ? 'bg-green-500 text-white shadow-lg'
                  : step.number === currentStep
                  ? 'bg-blue-600 text-white shadow-lg ring-4 ring-blue-200'
                  : 'bg-white/30 text-white border-2 border-white/50'
              }`}
            >
              {step.number < currentStep ? (
                <Check className="w-5 h-5" />
              ) : (
                step.number
              )}
            </div>
            
            {/* Step Title - Hidden on small screens */}
            <div className="absolute top-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
              <span className={`text-xs font-medium ${
                step.number <= currentStep ? 'text-white' : 'text-white/70'
              }`}>
                {step.title}
              </span>
            </div>
          </div>

          {/* Connector Line */}
          {index < steps.length - 1 && (
            <div
              className={`w-8 h-0.5 mx-2 transition-all duration-300 ${
                step.number < currentStep ? 'bg-green-500' : 'bg-white/30'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default ProgressIndicator;