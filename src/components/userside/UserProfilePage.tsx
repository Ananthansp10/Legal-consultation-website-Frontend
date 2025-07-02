import { useState } from 'react';
import { Edit3, User, Wallet, Shield, MapPin, Phone, Mail, Calendar, Building, Briefcase, X } from 'lucide-react';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

interface UserInfo {
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  profession: string;
  company: string;
  address: Address;
  joinDate: string;
  profileImage: string;
}

function UserProfilePage() {
  const [activeTab, setActiveTab] = useState('personal');
  const [showModal, setShowModal] = useState(false);

  const navigate=useNavigate()
  const user=useSelector((state:any)=>state.auth.user)

  const userInfo: UserInfo = {
    name: '',
    email: 'sarah.chen@email.com',
    phone: '',
    dateOfBirth: '',
    gender: '',
    profession: '',
    company: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    },
    joinDate: '2020-01-01',
    profileImage: 'https://tse1.mm.bing.net/th/id/OIP.SejAd161IGaSU4G9xY1RTwHaEK?pid=Api&P=0&h=180'
  };

  const [formState, setFormState] = useState<UserInfo>({ ...userInfo });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const key = name.split('.')[1] as keyof Address;
      setFormState((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [key]: value
        }
      }));
    } else {
      setFormState((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSave = () => {
    console.log('Updated Data:', formState);
    setShowModal(false);
  };

  const editableFields: (keyof UserInfo)[] = ['name', 'phone', 'dateOfBirth', 'gender', 'profession', 'company'];

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'security', label: 'Security', icon: Shield }
  ];

  const isPersonalInfoEmpty = !userInfo.name && !userInfo.phone && !userInfo.dateOfBirth && !userInfo.gender && !userInfo.profession && !userInfo.company;

  const renderWallet = () => (
    <div className="text-center py-12">
      <Wallet className="w-16 h-16 text-slate-400 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-slate-700 mb-2">Wallet Information</h3>
      <p className="text-slate-500">Billing and payment details will be displayed here.</p>
    </div>
  );

  const renderSecurity = () => (
    <div className="text-center py-12">
      <Shield className="w-16 h-16 text-slate-400 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-slate-700 mb-2">Security Settings</h3>
      <p className="text-slate-500">Password, 2FA, and security preferences will be shown here.</p>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return isPersonalInfoEmpty ? renderAddCard() : renderPersonalInfo();
      case 'wallet':
        return renderWallet();
      case 'security':
        return renderSecurity();
      default:
        return renderPersonalInfo();
    }
  };

  const renderAddCard = () => (
    <div className="text-center py-12">
      <User className="w-16 h-16 text-slate-400 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-slate-700 mb-2">No Personal Info Added</h3>
      <p className="text-slate-500 mb-4">You haven't added your personal profile details yet.</p>
      <button
        className="inline-flex items-center space-x-2 bg-blue-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-600 transition-all"
        onClick={() =>navigate('/user/add-profile')}
      >
        <Edit3 className="w-4 h-4" />
        <span>Add Profile</span>
      </button>
    </div>
  );

  const renderPersonalInfo = () => <div className="text-center py-12"> {/* Placeholder for filled profile */} </div>;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-4xl mx-auto mb-9">
        <Navbar userName={user.name} userAvatar="https://tse1.mm.bing.net/th/id/OIP.SejAd161IGaSU4G9xY1RTwHaEK?pid=Api&P=0&h=180" />
        <div className="mt-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-700 mb-2">My Profile</h1>
          <p className="text-slate-500 text-lg">Manage your account information</p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="flex rounded-2xl p-1 border border-slate-200 bg-white/50 backdrop-blur-sm">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-200 ${
                    activeTab === tab.id ? 'bg-blue-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm border border-slate-200 rounded-2xl p-8 shadow-lg max-w-4xl mx-auto">
          {renderTabContent()}

          {!isPersonalInfoEmpty && activeTab === 'personal' && (
            <div className="flex justify-center mt-8 pt-6 border-t border-slate-200">
              <button
                className="flex items-center space-x-2 bg-blue-500 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 hover:bg-blue-600 hover:shadow-lg hover:scale-105 active:scale-95"
                onClick={() => setShowModal(true)}
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            </div>
          )}
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-xl w-full max-w-2xl p-6 shadow-xl relative animate-in fade-in zoom-in duration-200">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-bold mb-6 text-slate-700">{isPersonalInfoEmpty ? 'Add Profile' : 'Edit Profile'}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {editableFields.map((field) => (
                  <div key={field}>
                    <label className="text-sm text-slate-500 font-medium mb-1 block capitalize">
                      {field.replace(/([A-Z])/g, ' $1').toLowerCase()}
                    </label>
                    <input
                      name={field}
                      value={formState[field] as string || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      type="text"
                    />
                  </div>
                ))}
                <div className="md:col-span-2">
                  <label className="text-sm text-slate-500 font-medium mb-1 block">Email (Not editable)</label>
                  <input
                    value={userInfo.email}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
                  />
                </div>
                {Object.keys(userInfo.address).map((key) => (
                  <div key={key}>
                    <label className="text-sm text-slate-500 font-medium mb-1 block capitalize">{key}</label>
                    <input
                      name={`address.${key}`}
                      value={formState.address[key as keyof Address] || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      type="text"
                    />
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserProfilePage;
