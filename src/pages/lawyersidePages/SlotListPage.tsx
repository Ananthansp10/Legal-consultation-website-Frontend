import { Edit, Clock, Calendar, AlertCircle, Filter, Power, PowerOff } from 'lucide-react';
import Navbar from '../../components/lawyer/Navbar';
import { useNavigate } from 'react-router-dom';
import { getSlot, updateRuleStatus } from '../../services/lawyer/lawyerService';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

interface SlotData {
  _id: string;
  name: string;
  description: string;
  days: string[];
  startTime: string;
  endTime: string;
  startDate?: string;
  endDate?: string;
  priority: number;
  breakTime: string;
  bufferTime: string;
  status: boolean;
}

function SlotListPage() {
  const getPriorityColor = (priority: number) => {
    if (priority >= 8) {
      return 'bg-red-100 text-red-800 border-red-200';
    } else if (priority >= 5) {
      return 'bg-orange-100 text-orange-800 border-orange-200';
    } else if (priority >= 3) {
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    } else {
      return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getPriorityLabel = (priority: number) => {
    if (priority >= 8) return 'High';
    if (priority >= 5) return 'Medium';
    if (priority >= 3) return 'Normal';
    return 'Low';
  };

  const navigate = useNavigate();
  const lawyerId: string | undefined = useSelector((state: RootState) => state?.lawyerAuth?.lawyer?._id);

  const [slots, setSlots] = useState<Array<SlotData>>();
  const [filterStatus,  setFilterStatus] = useState<'all' | 'enabled' | 'disabled' | string>('all');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  function fetchRules(type:string){
    getSlot(lawyerId!,type).then((response) => {
      setSlots(response.data.data);
    });
  }

  useEffect(() => {
    fetchRules('all')
  }, []);

  const handleEdit = (slotId: string) => {
    console.log('Edit slot:', slotId);
  };

  const handleToggleStatus = (slotId: string, currentStatus: boolean) => {
    console.log(currentStatus)
    updateRuleStatus(slotId,currentStatus).then((response)=>{
      toast.success(response.data.message)
      fetchRules('all')
    }).catch((error)=>{
      toast.error("Something went wrong")
    })
  };

  function filterRule(type:string){
    setFilterStatus(type)
    fetchRules(type)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />
      <div className="bg-white shadow-sm border-b border-slate-200 mt-7">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Legal Consultation Slots</h1>
              <p className="mt-2 text-slate-600">Manage your available consultation time slots</p>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-slate-500">{slots?.length} total slots</span>
              <button
                onClick={() => navigate('/lawyer/add-availablity')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 shadow-sm"
              >
                Add New Slot
              </button>
            </div>
          </div>

          {/* Filter Section */}
          <div className="mt-6 flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-slate-500" />
              <span className="text-sm font-medium text-slate-700">Filter by status:</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => filterRule('all')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 ${
                  filterStatus === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => filterRule('enabled')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 ${
                  filterStatus === 'enabled'
                    ? 'bg-green-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Enabled
              </button>
              <button
                onClick={() => filterRule('disabled')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 ${
                  filterStatus === 'disabled'
                    ? 'bg-red-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Disabled
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {slots?.map((slot) => (
            <div
              key={slot._id}
              className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border hover:border-slate-300 overflow-hidden group ${
                slot.status ? 'border-slate-200' : 'border-red-200 opacity-75'
              }`}
            >
              {/* Card Header */}
              <div className="p-6 pb-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors duration-200">
                      {slot.name}
                    </h3>
                    {slot.status ? (
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    ) : (
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    )}
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getPriorityColor(slot.priority)}`}>
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {getPriorityLabel(slot.priority)}
                  </span>
                </div>

                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  {slot.description}
                </p>

                {/* Status Badge */}
                <div className="mb-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                    slot.status
                      ? 'bg-green-100 text-green-800 border border-green-200'
                      : 'bg-red-100 text-red-800 border border-red-200'
                  }`}>
                    {slot.status ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {/* Days Available */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1.5">
                    {slot?.days.map((day) => (
                      <span
                        key={day}
                        className="inline-flex items-center px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-md border border-blue-200"
                      >
                        {day}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Time Information */}
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-slate-700">
                    <Clock className="w-4 h-4 mr-2 text-slate-500" />
                    <span className="font-medium">{slot.startTime} – {slot.endTime}</span>
                  </div>

                  {(slot.startDate || slot.endDate) && (
                    <div className="flex items-center text-sm text-slate-700">
                      <Calendar className="w-4 h-4 mr-2 text-slate-500" />
                      <span>
                        {slot.startDate && formatDate(slot.startDate)}
                        {slot.startDate && slot.endDate && ' – '}
                        {slot.endDate && formatDate(slot.endDate)}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-slate-500">
                      Break buffer: <span className="font-medium">{slot?.bufferTime} minutes</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Actions */}
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => handleEdit(slot?._id)}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200 border border-blue-200 hover:border-blue-300"
                >
                  <Edit className="w-4 h-4 mr-1.5" />
                  Edit
                </button>

                <button
                  onClick={() => handleToggleStatus(slot?._id, slot.status)}
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 border ${
                    slot.status
                      ? 'text-red-700 bg-red-50 hover:bg-red-100 border-red-200 hover:border-red-300'
                      : 'text-green-700 bg-green-50 hover:bg-green-100 border-green-200 hover:border-green-300'
                  }`}
                >
                  {slot.status ? (
                    <>
                      <PowerOff className="w-4 h-4 mr-1.5" />
                      Disable
                    </>
                  ) : (
                    <>
                      <Power className="w-4 h-4 mr-1.5" />
                      Enable
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State (if no slots) */}
        {slots?.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 max-w-md mx-auto">
              <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No consultation slots available</h3>
              <p className="text-slate-600 mb-6">Get started by creating your first consultation slot.</p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200">
                Create First Slot
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SlotListPage;