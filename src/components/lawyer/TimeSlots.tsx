import React, { useState } from 'react';
import { Clock, Plus, X, Zap, Timer } from 'lucide-react';

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
}

interface TimeSlotsProps {
  timeSlots: TimeSlot[];
  onTimeSlotsChange: (slots: TimeSlot[]) => void;
}

const TimeSlots: React.FC<TimeSlotsProps> = ({ timeSlots, onTimeSlotsChange }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 8; hour <= 20; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const display = new Date(`1970-01-01T${time}`).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });
        options.push({ value: time, display });
      }
    }
    return options;
  };

  const formatTimeSlot = (startTime: string, endTime: string) => {
    const start = new Date(`1970-01-01T${startTime}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    const end = new Date(`1970-01-01T${endTime}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    return `${start} – ${end}`;
  };

  const handleAddSlot = () => {
    if (startTime && endTime && startTime < endTime) {
      const newSlot: TimeSlot = {
        id: Date.now().toString(),
        startTime,
        endTime
      };
      onTimeSlotsChange([...timeSlots, newSlot]);
      setStartTime('');
      setEndTime('');
      setShowAddForm(false);
    }
  };

  const handleRemoveSlot = (id: string) => {
    onTimeSlotsChange(timeSlots.filter(slot => slot.id !== id));
  };

  const timeOptions = generateTimeOptions();

  return (
    <div className="group relative">
      {/* Animated background glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 rounded-3xl blur-lg opacity-20 group-hover:opacity-30 transition-all duration-500 animate-pulse"></div>
      
      <div className="relative backdrop-blur-xl bg-gradient-to-br from-white/30 to-white/10 border border-white/20 rounded-3xl shadow-2xl p-8 hover:shadow-purple-200/20 transition-all duration-500">
        {/* Floating particles effect */}
        <div className="absolute top-4 right-4 opacity-30">
          <Zap className="w-4 h-4 text-purple-400 animate-bounce" />
        </div>
        
        <div className="flex items-center space-x-4 mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl blur-md opacity-50"></div>
            <div className="relative p-3 bg-gradient-to-br from-purple-500 via-purple-600 to-blue-600 rounded-2xl shadow-lg">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
              Add Time Slots
            </h3>
            <p className="text-sm text-slate-500 font-medium">Define your availability windows</p>
          </div>
        </div>

        {/* Existing Time Slots */}
        {timeSlots.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <Timer className="w-4 h-4 text-slate-500" />
              <p className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
                Current time slots ({timeSlots.length})
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {timeSlots.map((slot, index) => (
                <div
                  key={slot.id}
                  className="group/slot relative animate-in slide-in-from-left duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Slot glow effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full blur opacity-0 group-hover/slot:opacity-30 transition-all duration-300"></div>
                  
                  <div className="relative inline-flex items-center px-6 py-3 bg-gradient-to-r from-white/40 to-white/20 border border-white/30 rounded-full text-sm font-semibold text-slate-700 backdrop-blur-sm hover:from-white/50 hover:to-white/30 transition-all duration-300 group-hover/slot:scale-105 shadow-lg hover:shadow-xl">
                    <span className="mr-3">{formatTimeSlot(slot.startTime, slot.endTime)}</span>
                    <button
                      onClick={() => handleRemoveSlot(slot.id)}
                      className="p-1.5 hover:bg-red-100/80 rounded-full transition-all duration-200 group-hover/slot:scale-110 hover:shadow-lg"
                    >
                      <X className="w-3.5 h-3.5 text-red-500 hover:text-red-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add New Slot Form */}
        {showAddForm ? (
          <div className="relative animate-in slide-in-from-top duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-3xl blur-xl"></div>
            <div className="relative p-6 bg-gradient-to-br from-white/40 to-white/20 rounded-3xl border border-white/30 backdrop-blur-sm mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider">
                    Start Time
                  </label>
                  <div className="relative">
                    <select
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full p-4 rounded-2xl border border-white/30 bg-white/60 backdrop-blur-sm focus:ring-4 focus:ring-blue-200/50 focus:border-blue-400 transition-all duration-300 text-slate-700 font-semibold shadow-lg hover:shadow-xl appearance-none cursor-pointer"
                    >
                      <option value="">Select start time</option>
                      {timeOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.display}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider">
                    End Time
                  </label>
                  <div className="relative">
                    <select
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full p-4 rounded-2xl border border-white/30 bg-white/60 backdrop-blur-sm focus:ring-4 focus:ring-purple-200/50 focus:border-purple-400 transition-all duration-300 text-slate-700 font-semibold shadow-lg hover:shadow-xl appearance-none cursor-pointer"
                    >
                      <option value="">Select end time</option>
                      {timeOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.display}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={handleAddSlot}
                  disabled={!startTime || !endTime || startTime >= endTime}
                  className="relative px-8 py-4 bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 text-white rounded-2xl font-bold shadow-2xl hover:shadow-blue-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 overflow-hidden group/btn"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative">Add Slot</span>
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setStartTime('');
                    setEndTime('');
                  }}
                  className="px-8 py-4 bg-white/50 text-slate-700 rounded-2xl font-bold hover:bg-white/70 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowAddForm(true)}
            className="group/add relative w-full md:w-auto inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 text-white rounded-2xl font-bold shadow-2xl hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105 overflow-hidden"
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/add:translate-x-full transition-transform duration-700"></div>
            
            <Plus className="w-5 h-5 mr-3 group-hover/add:rotate-90 transition-transform duration-300" />
            <span className="relative">Add Time Slot</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default TimeSlots;