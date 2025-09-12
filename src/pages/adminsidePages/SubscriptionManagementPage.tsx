import React, { useEffect, useState } from 'react';
import { Plus, CreditCard, TrendingUp, TrendingDown, Star, DollarSign, Edit2, Power, Trash2, X } from 'lucide-react';
import { addSubscriptionPlans, changePlanStatus, getSubscriptionPlans, planDelete, planEdit } from '../../services/admin/adminService';
import { toast } from 'react-toastify';
import Navbar from '../../components/admin/Navbar';
import ConfirmModal from '../../components/reusableComponents/ConfirmModal';

type PlanType = 'weekly' | 'monthly' | 'yearly';

interface Plan {
  _id ? : string;
  name: string;
  price: number;
  duration: number;
  planType: PlanType;
  features: string[];
  status ?: boolean;
}

interface Stat {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const SubscriptionPlanManagement: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    duration: '30',
    planType: 'monthly' as PlanType,
    features: [] as string[]
  });
  const [newFeature, setNewFeature] = useState<string>('');

  const [plans, setPlans] = useState<Plan[]>([]);
  const [refresh,setRefresh]=useState(false)
  const [planId,setPlanId]=useState('')
  const [isEdit,setIsEdit]=useState(false)
  const [confirmationModal,setConfirmationModal]=useState(false)

  const stats: Stat[] = [
    {
      title: 'Active Plans',
      value: plans.filter(p => p.status).length,
      icon: TrendingUp,
      trend: { value: 8.2, isPositive: true }
    },
    {
      title: 'Inactive Plans',
      value: plans.filter(p => !p.status).length,
      icon: TrendingDown,
      trend: { value: 2.1, isPositive: false }
    },
    {
      title: 'Most Popular',
      value: 'Professional',
      icon: Star,
    },
    {
      title: 'Monthly Revenue',
      value: '₹2,45,890',
      icon: DollarSign,
      trend: { value: 12.5, isPositive: true }
    }
  ];

  const openModal = (): void => {
    setFormData({
      name: '',
      price: '',
      duration: '30',
      planType: 'monthly',
      features: []
    });
    setNewFeature('');
    setIsModalOpen(true);
  };

  const closeModal = (): void => {
    setIsModalOpen(false);
    setFormData({
      name: '',
      price: '',
      duration: '30',
      planType: 'monthly',
      features: []
    });
    setNewFeature('');
  };

  const handleInputChange = (field: keyof typeof formData, value: string | PlanType): void => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addFeature = (): void => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (featureToRemove: string): void => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter(feature => feature !== featureToRemove)
    }));
  };

  const handleSubmit = (): void => {
    if (!formData.name || !formData.price || formData.features.length === 0) {
      alert('Please fill in all required fields');
      return;
    }

    if(isEdit){
      planEdit(planId,{...formData,price:parseInt(formData.price),duration:parseInt(formData.duration)}).then((response)=>{
        closeModal()
        setIsEdit(false)
        setPlanId('')
        setRefresh(!refresh)
        toast.success(response.data.message)
      })
    }else{

    const newPlan: Plan = {
      name: formData.name,
      price: parseInt(formData.price),
      duration: parseInt(formData.duration),
      planType: formData.planType,
      features: formData.features,
    };

    addSubscriptionPlans(newPlan).then((response)=>{
      closeModal();
      setRefresh(!refresh)
      toast.success(response.data.message)
    });
  }
  };

  useEffect(()=>{
    getSubscriptionPlans().then((response)=>{
      setPlans(response.data.data)
    })
  },[refresh])

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      addFeature();
    }
  };

  function togglePlanStatus(planId:string,status:string){
    changePlanStatus(planId,status).then((response)=>{
      setRefresh(!refresh)
      toast.success(response.data.message)
    })
  }

  function deletePlan(planId:string){
    setPlanId(planId)
    setConfirmationModal(true)
  }

  function editPlan(planId:string){
    const findPlan=plans.filter((plan)=>plan._id==planId)
    setFormData({...findPlan[0],price:findPlan[0].price.toString(),duration:findPlan[0].duration.toString()})
    setIsEdit(true)
    setPlanId(planId)
    setIsModalOpen(true)
  }

  const getTypeColor = (type: PlanType): string => {
    switch (type) {
      case 'monthly':
        return 'bg-blue-100 text-blue-800';
      case 'weekly':
        return 'bg-green-100 text-green-800';
      case 'yearly':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto mt-1">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-8 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-1">Subscription Plans</h1>
                <p className="text-gray-600">Manage subscription plans for lawyers</p>
              </div>
            </div>
            <button 
              onClick={openModal}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Add Plan</span>
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-lg hover:scale-105 transition-all duration-300 hover:shadow-xl border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                  {stat.trend && (
                    <div className={`flex items-center mt-2 text-xs ${stat.trend.isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
                      {stat.trend.isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                      {Math.abs(stat.trend.value)}%
                    </div>
                  )}
                </div>
                <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-3">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Plans Table */}
        <div className="mb-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">All Plans</h2>
            <p className="text-gray-600">View and manage all subscription plans</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-white/20 border-b border-white/20">
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-800">Plan Name</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-800">Type</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-800">Price</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-800">Duration</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-800">Features</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-800">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-800">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {plans?.map((plan) => (
                    <tr
                      key={plan._id}
                      className="border-b border-white/10 hover:bg-white/10 transition-all duration-200"
                    >
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-800">{plan.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(plan.planType)}`}>
                          {plan.planType.charAt(0).toUpperCase() + plan.planType.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-lg font-semibold text-blue-600">₹{plan.price.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-700">{plan.duration} days</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {plan.features.slice(0, 3).map((feature, index) => (
                            <span
                              key={index}
                              className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                            >
                              {feature}
                            </span>
                          ))}
                          {plan.features.length > 3 && (
                            <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                              +{plan.features.length - 3} more
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            plan.status
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {plan.status ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button onClick={()=>editPlan(plan._id!)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all duration-200 group"
                            aria-label={`Edit ${plan.name} plan`}
                          >
                            <Edit2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          </button>
                          <button onClick={()=>togglePlanStatus(plan._id!, plan.status ? 'Deactivate' : 'Activate')}
                            className={`p-2 rounded-lg transition-all duration-200 group ${
                              plan.status
                                ? 'text-orange-600 hover:bg-orange-100'
                                : 'text-emerald-600 hover:bg-emerald-100'
                            }`}
                            aria-label={`${plan.status ? 'Deactivate' : 'Activate'} ${plan.name} plan`}
                          >
                            <Power className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          </button>
                          <button onClick={()=>deletePlan(plan._id!)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all duration-200 group"
                            aria-label={`Delete ${plan.name} plan`}
                          >
                            <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 w-full max-w-lg">
              <div className="flex items-center justify-between p-6 border-b border-white/20">
                <h2 className="text-2xl font-bold text-gray-800">
                  Add New Plan
                </h2>
                <button 
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <label htmlFor="planName" className="block text-sm font-medium text-gray-700 mb-2">
                    Plan Name *
                  </label>
                  <input
                    id="planName"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    placeholder="Enter plan name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="planType" className="block text-sm font-medium text-gray-700 mb-2">
                      Plan Type *
                    </label>
                    <select
                      id="planType"
                      value={formData.planType}
                      onChange={(e) => handleInputChange('planType', e.target.value as PlanType)}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    >
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="planPrice" className="block text-sm font-medium text-gray-700 mb-2">
                      Price (₹) *
                    </label>
                    <input
                      id="planPrice"
                      type="number"
                      min="0"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="planDuration" className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (days)
                  </label>
                  <input
                    id="planDuration"
                    type="number"
                    min="1"
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    placeholder="30"
                  />
                </div>

                <div>
                  <label htmlFor="newFeature" className="block text-sm font-medium text-gray-700 mb-2">
                    Features *
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      id="newFeature"
                      type="text"
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="flex-1 px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                      placeholder="Add a feature"
                    />
                    <button 
                      onClick={addFeature}
                      type="button"
                      className="px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all"
                      aria-label="Add feature"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.features.map((feature, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-800 cursor-pointer hover:bg-blue-200 transition-colors"
                      >
                        {feature}
                        <button
                          onClick={() => removeFeature(feature)}
                          className="ml-1 hover:text-red-600"
                          type="button"
                          aria-label={`Remove ${feature} feature`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  {formData.features.length === 0 && (
                    <p className="text-xs text-gray-500 mt-2">Add at least one feature</p>
                  )}
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button 
                    onClick={closeModal}
                    type="button"
                    className="px-6 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSubmit}
                    type="button"
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all"
                  >
                    Save Plan
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {confirmationModal && <ConfirmModal message='Are you sure want to delete this plan' onConfirm={()=>planDelete(planId).then((response)=>{
        setPlanId('')
        setRefresh(!refresh)
        setConfirmationModal(false)
        toast.success(response.data.message)
      })} onCancel={()=>setConfirmationModal(false)}/>}
    </div>
  );
};

export default SubscriptionPlanManagement;