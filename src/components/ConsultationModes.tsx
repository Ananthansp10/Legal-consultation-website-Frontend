import React from 'react';
import { Video, MapPin, Clock, Users } from 'lucide-react';

const ConsultationModes = () => {
  const modes = [
    {
      icon: Video,
      title: "Online Consultation",
      description: "Connect with lawyers through secure video calls from the comfort of your home",
      features: ["Video & Voice Calls", "Screen Sharing", "Document Upload", "Instant Messaging"],
      color: "blue"
    },
    {
      icon: MapPin,
      title: "Offline Consultation",
      description: "Meet lawyers in person at their office or a convenient location near you",
      features: ["In-Person Meetings", "Office Visits", "Document Review", "Face-to-Face Discussion"],
      color: "green"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-4">
            Consultation Modes
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Choose the consultation method that works best for you - online for convenience or offline for personal interaction.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {modes.map((mode, index) => {
            const Icon = mode.icon;
            const colorClass = mode.color === 'blue' ? 'blue' : 'green';

            return (
              <div key={index} className="group bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="flex items-start space-x-6">
                  <div className={`w-16 h-16 bg-${colorClass}-500/10 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-${colorClass}-500/20 transition-colors duration-300`}>
                    <Icon className={`h-8 w-8 text-${colorClass}-500`} />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-slate-800 mb-4">{mode.title}</h3>
                    <p className="text-slate-600 mb-6 leading-relaxed">{mode.description}</p>

                    <div className="space-y-3">
                      {mode.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center space-x-3">
                          <div className={`w-2 h-2 bg-${colorClass}-500 rounded-full`}></div>
                          <span className="text-slate-600">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <button className={`mt-6 px-8 py-3 bg-${colorClass}-500 hover:bg-${colorClass}-600 text-white rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-${colorClass}-500/25`}>
                      Choose This Mode
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ConsultationModes;