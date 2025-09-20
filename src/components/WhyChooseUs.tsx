import React from 'react';
import { Shield, Video, Lock, FileText, MessageSquare, CheckCircle } from 'lucide-react';

const WhyChooseUs = () => {
  const features = [
    {
      icon: CheckCircle,
      title: "Verified Lawyers",
      description: "All our lawyers are thoroughly vetted and verified professionals"
    },
    {
      icon: Video,
      title: "Online & Offline",
      description: "Choose between convenient online consultations or in-person meetings"
    },
    {
      icon: Lock,
      title: "Secure & Confidential",
      description: "Your information is protected with bank-level security"
    },
    {
      icon: FileText,
      title: "Document Sharing",
      description: "Easily upload and share documents with your lawyer"
    },
    {
      icon: MessageSquare,
      title: "Chat Management",
      description: "Integrated chat and appointment management system"
    },
    {
      icon: Shield,
      title: "Money Back Guarantee",
      description: "100% satisfaction guaranteed or your money back"
    }
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-4">
            Why Choose LegalConnect
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            We provide the most comprehensive and secure platform for legal consultations with features designed for your convenience.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="group bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105 text-center">
                <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-500/20 transition-colors duration-300">
                  <Icon className="h-8 w-8 text-blue-500" />
                </div>

                <h3 className="text-xl font-bold text-slate-800 mb-4">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;