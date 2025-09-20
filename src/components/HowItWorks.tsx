import React from 'react';
import { UserPlus, Users, MessageCircle } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: UserPlus,
      title: "Sign Up",
      description: "Create your account and tell us about your legal needs",
      number: "01"
    },
    {
      icon: Users,
      title: "Choose a Lawyer",
      description: "Browse our verified lawyers and select the perfect match",
      number: "02"
    },
    {
      icon: MessageCircle,
      title: "Get Consultation",
      description: "Connect online or offline for personalized legal advice",
      number: "03"
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Getting expert legal help has never been easier. Follow these simple steps to connect with the right lawyer for your needs.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="group relative">
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105 text-center">
                  {/* Step Number */}
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-500/20 transition-colors duration-300">
                    <Icon className="h-8 w-8 text-blue-500" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-slate-800 mb-4">{step.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{step.description}</p>
                </div>

                {/* Connecting Line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-blue-500 to-blue-300 transform -translate-y-1/2"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;