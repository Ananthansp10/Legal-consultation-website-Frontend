import { useState } from 'react';
import { Calendar, Clock, Settings, Info, Plus, Trash2, Save, X } from 'lucide-react';
import LawyerNavbar from '../../components/lawyer/Navbar';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { addSlot } from '../../services/lawyer/lawyerService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

interface BreakTime {
  id: string;
  startTime: string;
  endTime: string;
}

interface BookingRule {
  ruleName: string;
  description: string;
  daysOfWeek: string[];
  startTime: string;
  endTime: string;
  startDate: string;
  endDate: string;
  priority: number;
  breakTimes: BreakTime[];
  bufferTime: number;
}

const DAYS_OF_WEEK = [
  { id: 'mon', label: 'Mon', full: 'Monday' },
  { id: 'tue', label: 'Tue', full: 'Tuesday' },
  { id: 'wed', label: 'Wed', full: 'Wednesday' },
  { id: 'thu', label: 'Thu', full: 'Thursday' },
  { id: 'fri', label: 'Fri', full: 'Friday' },
  { id: 'sat', label: 'Sat', full: 'Saturday' },
  { id: 'sun', label: 'Sun', full: 'Sunday' },
];

const convertTo12Hour = (time24: string): string => {
  if (!time24) return '';
  const [hours, minutes] = time24.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
};

const convertTo24Hour = (time12: string): string => {
  if (!time12) return '';
  const [time, ampm] = time12.split(' ');
  const [hours, minutes] = time.split(':');
  let hour = parseInt(hours, 10);

  if (ampm === 'PM' && hour !== 12) {
    hour += 12;
  } else if (ampm === 'AM' && hour === 12) {
    hour = 0;
  }
  return `${hour.toString().padStart(2, '0')}:${minutes}`;
};

const generateTimeOptions = (): string[] => {
  const options: string[] = [];
  for (let hour = 1; hour <= 12; hour++) {
    for (let minute of ['00', '15', '30', '45']) {
      options.push(`${hour}:${minute} AM`);
    }
  }
  for (let hour = 1; hour <= 12; hour++) {
    for (let minute of ['00', '15', '30', '45']) {
      options.push(`${hour}:${minute} PM`);
    }
  }
  return options;
};

const TIME_OPTIONS = generateTimeOptions();

function AvailabilityAddPage() {
  const [rule, setRule] = useState<BookingRule>({
    ruleName: '',
    description: '',
    daysOfWeek: [],
    startTime: '',
    endTime: '',
    startDate: '',
    endDate: '',
    priority: 1,
    breakTimes: [],
    bufferTime: 30,
  });

  const [showTooltip, setShowTooltip] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const navigate = useNavigate();
  const lawyerId: string | undefined = useSelector((state: RootState) => state?.lawyerAuth?.lawyer?._id);

  // Helper for excluding today's date
  const getTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const isTimeAfter = (startTime: string, endTime: string): boolean => {
    if (!startTime || !endTime) return true;
    const start24 = convertTo24Hour(startTime);
    const end24 = convertTo24Hour(endTime);
    return start24 < end24;
  };

  const isDateAfter = (startDate: string, endDate: string): boolean => {
    if (!startDate || !endDate) return true;
    return new Date(startDate) <= new Date(endDate);
  };

  // Expanded field-level validation
  const validateForm = (): boolean => {
    const errors: {[key: string]: string} = {};

    if (!rule.ruleName.trim()) errors.ruleName = 'Rule name is required';
    if (!rule.description.trim()) errors.description = 'Description is required';
    if (!rule.daysOfWeek.length) errors.daysOfWeek = 'Select at least one day';
    if (!rule.startTime) errors.startTime = 'Start time is required';
    if (!rule.endTime) errors.endTime = 'End time is required';

    // Time range validation
    if (rule.startTime && rule.endTime && !isTimeAfter(rule.startTime, rule.endTime)) {
      errors.timeRange = 'Start time must be before end time';
    }

    // Date validation: start date must not be today or before today
    if (!rule.startDate) {
      errors.startDate = 'Start date is required';
    } else {
      const selectedStart = new Date(rule.startDate);
      const today = new Date();
      today.setHours(0,0,0,0);
      if (selectedStart <= today) {
        errors.startDate = 'Start date must be in the future (not today)';
      }
    }

    // End date must be after start date (or empty)
    if (rule.startDate && !rule.endDate) {
      errors.endDate = 'End date required if start date is set';
    }
    if (rule.startDate && rule.endDate && !isDateAfter(rule.startDate, rule.endDate)) {
      errors.dateRange = 'Start date must be before or equal to end date';
    }

    // Priority validation
    if (!String(rule.priority) || rule.priority < 1) {
      errors.priority = 'Priority must be greater than 0';
    }

    // Break time validation
    rule.breakTimes.forEach((b, idx) => {
      if (!b.startTime) {
        errors[`breakTime_${idx}`] = 'Break start time required';
      } else if (!b.endTime) {
        errors[`breakTime_${idx}`] = 'Break end time required';
      } else if (!isTimeAfter(b.startTime, b.endTime)) {
        errors[`breakTime_${idx}`] = 'Break start must be before end';
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const addBreakTime = () => {
    const newBreakTime: BreakTime = {
      id: Date.now().toString(),
      startTime: '',
      endTime: '',
    };
    setRule(prev => ({
      ...prev,
      breakTimes: [...prev.breakTimes, newBreakTime],
    }));
  };

  const removeBreakTime = (id: string) => {
    setRule(prev => ({
      ...prev,
      breakTimes: prev.breakTimes.filter(bt => bt.id !== id),
    }));
    const newErrors = { ...validationErrors };
    const breakIndex = rule.breakTimes.findIndex(bt => bt.id === id);
    delete newErrors[`breakTime_${breakIndex}`];
    setValidationErrors(newErrors);
  };

  const updateBreakTime = (id: string, field: 'startTime' | 'endTime', value: string) => {
    setRule(prev => ({
      ...prev,
      breakTimes: prev.breakTimes.map(bt => 
        bt.id === id ? { ...bt, [field]: value } : bt
      ),
    }));
    const breakIndex = rule.breakTimes.findIndex(bt => bt.id === id);
    const errorKey = `breakTime_${breakIndex}`;
    if (validationErrors[errorKey]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  const toggleDay = (dayId: string) => {
    setRule(prev => ({
      ...prev,
      daysOfWeek: prev.daysOfWeek.includes(dayId)
        ? prev.daysOfWeek.filter(d => d !== dayId)
        : [...prev.daysOfWeek, dayId],
    }));
    if (validationErrors.daysOfWeek) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.daysOfWeek;
        return newErrors;
      });
    }
  };

  const handleTimeChange = (field: 'startTime' | 'endTime', value: string) => {
    setRule(prev => ({ ...prev, [field]: value }));
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
    if (validationErrors.timeRange) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.timeRange;
        return newErrors;
      });
    }
  };

  const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
    setRule(prev => ({ ...prev, [field]: value }));
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
    if (validationErrors.dateRange) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.dateRange;
        return newErrors;
      });
    }
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }
    const breakTimes = rule.breakTimes.map((time) => {
      return {
        startTime: time.startTime,
        endTime: time.endTime
      };
    });
    const ruleData = {
      ...rule,
      name: rule.ruleName,
      days: rule.daysOfWeek,
      breakTimes: breakTimes,
      startTime: rule.startTime,
      endTime: rule.endTime 
    };
    addSlot(lawyerId!, ruleData).then((response) => {
      toast.success(response.data.message);
      navigate('/lawyer/slot-list-page');
    }).catch((error) => {
      toast.error("Something went wrong");
    });
  };

  const handleCancel = () => {
    console.log('Cancelling form');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <LawyerNavbar/>
      </div>
      {/* Main Content Container with top padding to account for fixed navbar */}
      <div className="pt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Booking Rule</h1>
            <p className="text-gray-600">Set up automated slot booking rules for your calendar</p>
          </div>
          {/* Main Form Card */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="p-8">
              {/* Rule Name & Description Section */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                    <Settings className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rule Name
                    </label>
                    <input
                      type="text"
                      value={rule.ruleName}
                      onChange={(e) => setRule(prev => ({ ...prev, ruleName: e.target.value }))}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 ${validationErrors.ruleName ? 'border-red-300' : 'border-gray-300'}`}
                      placeholder="e.g., Morning Meetings"
                    />
                    {validationErrors.ruleName && (
                      <p className="mt-2 text-sm text-red-600">{validationErrors.ruleName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={rule.description}
                      onChange={(e) => setRule(prev => ({ ...prev, description: e.target.value }))}
                      rows={4}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 resize-none ${validationErrors.description ? 'border-red-300' : 'border-gray-300'}`}
                      placeholder="Describe when and how this rule should be applied..."
                    />
                    {validationErrors.description && (
                      <p className="mt-2 text-sm text-red-600">{validationErrors.description}</p>
                    )}
                  </div>
                </div>
              </div>
              <hr className="border-gray-200 mb-8" />
              {/* Days of Week Section */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Days of Week</h2>
                </div>
                <div className="flex flex-wrap gap-3">
                  {DAYS_OF_WEEK.map((day) => (
                    <button
                      key={day.id}
                      type="button"
                      onClick={() => toggleDay(day.id)}
                      className={`px-4 py-2 rounded-lg border-2 transition-all duration-200 ${
                        rule.daysOfWeek.includes(day.id)
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white border-transparent shadow-md'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {day.label}
                    </button>
                  ))}
                </div>
                {validationErrors.daysOfWeek && (
                  <p className="mt-2 text-sm text-red-600">{validationErrors.daysOfWeek}</p>
                )}
              </div>
              <hr className="border-gray-200 mb-8" />
              {/* Time Range Section */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Time Range</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Time
                    </label>
                    <select
                      value={rule.startTime}
                      onChange={(e) => handleTimeChange('startTime', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 ${validationErrors.startTime ? 'border-red-300' : 'border-gray-300'}`}
                    >
                      <option value="">Select start time</option>
                      {TIME_OPTIONS.map((time) => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                    {validationErrors.startTime && (
                      <p className="mt-2 text-sm text-red-600">{validationErrors.startTime}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Time
                    </label>
                    <select
                      value={rule.endTime}
                      onChange={(e) => handleTimeChange('endTime', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 ${validationErrors.endTime ? 'border-red-300' : 'border-gray-300'}`}
                    >
                      <option value="">Select end time</option>
                      {TIME_OPTIONS.map((time) => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                    {validationErrors.endTime && (
                      <p className="mt-2 text-sm text-red-600">{validationErrors.endTime}</p>
                    )}
                  </div>
                </div>
                {validationErrors.timeRange && (
                  <p className="mt-2 text-sm text-red-600">{validationErrors.timeRange}</p>
                )}
              </div>
              <hr className="border-gray-200 mb-8" />
              {/* Date Range Section */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-600 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Date Range</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={rule.startDate}
                      min={getTomorrow()}
                      onChange={(e) => handleDateChange('startDate', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 ${validationErrors.startDate ? 'border-red-300' : 'border-gray-300'}`}
                    />
                    {validationErrors.startDate && (
                      <p className="mt-2 text-sm text-red-600">{validationErrors.startDate}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={rule.endDate}
                      min={rule.startDate || getTomorrow()}
                      onChange={(e) => handleDateChange('endDate', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 ${validationErrors.endDate ? 'border-red-300' : 'border-gray-300'}`}
                    />
                    {validationErrors.endDate && (
                      <p className="mt-2 text-sm text-red-600">{validationErrors.endDate}</p>
                    )}
                  </div>
                </div>
                {validationErrors.dateRange && (
                  <p className="mt-2 text-sm text-red-600">{validationErrors.dateRange}</p>
                )}
              </div>
              <hr className="border-gray-200 mb-8" />
              {/* Priority & Buffer Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <p className="text-xs text-gray-500 mb-3">Higher number = higher priority</p>
                  <input
                    type="number"
                    min="1"
                    value={rule.priority}
                    onChange={(e) => setRule(prev => ({ ...prev, priority: parseInt(e.target.value) || 1 }))}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 ${validationErrors.priority ? 'border-red-300' : 'border-gray-300'}`}
                  />
                  {validationErrors.priority && (
                    <p className="mt-2 text-sm text-red-600">{validationErrors.priority}</p>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <label className="text-sm font-medium text-gray-700">
                      Buffer Time (minutes)
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onMouseEnter={() => setShowTooltip(true)}
                        onMouseLeave={() => setShowTooltip(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Info className="w-4 h-4" />
                      </button>
                      {showTooltip && (
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap z-10">
                          Time between consecutive bookings
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">Minutes between bookings</p>
                  <input
                    disabled
                    type="number"
                    min="0"
                    value={rule.bufferTime}
                    onChange={(e) => setRule(prev => ({ ...prev, bufferTime: parseInt(e.target.value) || 0 }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                  />
                </div>
              </div>
              <hr className="border-gray-200 mb-8" />
              {/* Break Times Section */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">Break Times</h2>
                  </div>
                  <button
                    type="button"
                    onClick={addBreakTime}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <Plus className="w-4 h-4" />
                    Add Break
                  </button>
                </div>
                <div className="space-y-4">
                  {rule.breakTimes.map((breakTime, index) => {
                    const errorKey = `breakTime_${index}`;
                    const hasError = !!validationErrors[errorKey];
                    return (
                      <div key={breakTime.id} className={`p-4 rounded-lg border ${hasError ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}>
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-medium text-gray-700 w-16">Break {index + 1}</span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                            <select
                              value={breakTime.startTime}
                              onChange={(e) => updateBreakTime(breakTime.id, 'startTime', e.target.value)}
                              className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${hasError ? 'border-red-300' : 'border-gray-300'}`}
                            >
                              <option value="">Select start time</option>
                              {TIME_OPTIONS.map((time) => (
                                <option key={time} value={time}>{time}</option>
                              ))}
                            </select>
                            <select
                              value={breakTime.endTime}
                              onChange={(e) => updateBreakTime(breakTime.id, 'endTime', e.target.value)}
                              className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${hasError ? 'border-red-300' : 'border-gray-300'}`}
                            >
                              <option value="">Select end time</option>
                              {TIME_OPTIONS.map((time) => (
                                <option key={time} value={time}>{time}</option>
                              ))}
                            </select>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeBreakTime(breakTime.id)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        {hasError && (
                          <p className="mt-2 text-sm text-red-600 ml-20">{validationErrors[errorKey]}</p>
                        )}
                      </div>
                    );
                  })}
                  {rule.breakTimes.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>No break times defined. Click "Add Break" to add one.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* Action Buttons */}
            <div className="bg-gray-50 px-8 py-6 border-t border-gray-200 flex flex-col-reverse sm:flex-row gap-4 sm:justify-end">
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-white hover:border-gray-400 transition-all duration-200 font-medium"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
              >
                <Save className="w-4 h-4" />
                Save Rule
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default AvailabilityAddPage;
