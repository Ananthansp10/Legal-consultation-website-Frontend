import React from 'react';
import { Calendar, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

interface DatePickerProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({ selectedDate, onDateSelect }) => {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prevMonth => {
      const newMonth = new Date(prevMonth);
      if (direction === 'prev') {
        newMonth.setMonth(newMonth.getMonth() - 1);
      } else {
        newMonth.setMonth(newMonth.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const isDateDisabled = (date: Date) => {
    return date < today;
  };

  const isDateSelected = (date: Date) => {
    if (!selectedDate) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString();
  };

  const handleDateClick = (date: Date) => {
    if (!isDateDisabled(date)) {
      onDateSelect(date);
    }
  };

  const formatSelectedDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const days = getDaysInMonth(currentMonth);
  const monthYear = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="group relative">
      {/* Animated background glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 via-purple-400 to-blue-600 rounded-3xl blur-lg opacity-20 group-hover:opacity-30 transition-all duration-500 animate-pulse"></div>
      
      <div className="relative backdrop-blur-xl bg-gradient-to-br from-white/30 to-white/10 border border-white/20 rounded-3xl shadow-2xl p-8 hover:shadow-blue-200/20 transition-all duration-500">
        {/* Floating particles effect */}
        <div className="absolute top-4 right-4 opacity-30">
          <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
        </div>
        
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-md opacity-50"></div>
              <div className="relative p-3 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-2xl shadow-lg">
                <Calendar className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
                Select Date
              </h3>
              <p className="text-sm text-slate-500 font-medium">Choose your available day</p>
            </div>
          </div>
        </div>

        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigateMonth('prev')}
            className="group/btn p-3 hover:bg-white/20 rounded-2xl transition-all duration-300 hover:scale-110 hover:shadow-lg"
          >
            <ChevronLeft className="w-6 h-6 text-slate-600 group-hover/btn:text-blue-600 transition-colors duration-300" />
          </button>
          <div className="text-center">
            <h4 className="text-2xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
              {monthYear}
            </h4>
          </div>
          <button
            onClick={() => navigateMonth('next')}
            className="group/btn p-3 hover:bg-white/20 rounded-2xl transition-all duration-300 hover:scale-110 hover:shadow-lg"
          >
            <ChevronRight className="w-6 h-6 text-slate-600 group-hover/btn:text-blue-600 transition-colors duration-300" />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2 mb-6">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-3 text-center text-sm font-bold text-slate-500 uppercase tracking-wider">
              {day}
            </div>
          ))}
          {days.map((date, index) => (
            <div key={index} className="aspect-square p-1">
              {date && (
                <button
                  onClick={() => handleDateClick(date)}
                  disabled={isDateDisabled(date)}
                  className={`
                    relative w-full h-full rounded-2xl transition-all duration-300 text-sm font-bold overflow-hidden group/date
                    ${isDateDisabled(date)
                      ? 'text-slate-300 cursor-not-allowed bg-slate-100/30'
                      : isDateSelected(date)
                      ? 'bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 text-white shadow-2xl shadow-blue-500/40 scale-110 z-10'
                      : isToday(date)
                      ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-200 hover:scale-105'
                      : 'text-slate-700 hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 hover:shadow-xl hover:scale-105 hover:text-blue-700'
                    }
                  `}
                >
                  {/* Shimmer effect for available dates */}
                  {!isDateDisabled(date) && !isDateSelected(date) && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/date:translate-x-full transition-transform duration-700"></div>
                  )}
                  
                  {/* Glow effect for selected date */}
                  {isDateSelected(date) && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl blur-xl opacity-50 animate-pulse"></div>
                  )}
                  
                  <span className="relative z-10">{date.getDate()}</span>
                  
                  {/* Today indicator */}
                  {isToday(date) && !isDateSelected(date) && (
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full"></div>
                  )}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Selected Date Display */}
        {selectedDate && (
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-2xl blur-xl"></div>
            <div className="relative p-6 bg-gradient-to-br from-white/40 to-white/20 rounded-2xl border border-white/30 backdrop-blur-sm">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl shadow-lg">
                  <Calendar className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">You selected:</p>
                  <p className="text-lg font-bold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
                    {formatSelectedDate(selectedDate)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DatePicker;