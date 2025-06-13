import React, { useState } from 'react';
import { Eye, Search, Filter, Ban, Trash2, ChevronLeft, ChevronRight, UserCheck } from 'lucide-react';
import GlassCard from '../../components/admin/GlassCard';
import Button from '../../components/admin/Button';
import Modal from '../../components/admin/Modal';
import Badge from '../../components/admin/Badge';
import ConfirmationModal from '../../components/admin/ConfirmationModal';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  location: string;
  profileImage: string;
  status: 'active' | 'blocked';
  appointmentCount: number;
  joinedDate: string;
  lastLogin: string;
}

const UserListing: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean;
    type: 'block' | 'unblock' | 'delete';
    user: User | null;
  }>({ isOpen: false, type: 'block', user: null });
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data
  const users: User[] = [
    {
      id: 1,
      name: 'Alice Cooper',
      email: 'alice.cooper@email.com',
      phone: '+1 (555) 123-4567',
      location: 'New York, NY',
      profileImage: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=400',
      status: 'active',
      appointmentCount: 8,
      joinedDate: '2023-01-15',
      lastLogin: '2024-01-20',
    },
    {
      id: 2,
      name: 'Bob Wilson',
      email: 'bob.wilson@email.com',
      phone: '+1 (555) 234-5678',
      location: 'Los Angeles, CA',
      profileImage: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400',
      status: 'active',
      appointmentCount: 12,
      joinedDate: '2023-02-20',
      lastLogin: '2024-01-19',
    },
    {
      id: 3,
      name: 'Carol Davis',
      email: 'carol.davis@email.com',
      phone: '+1 (555) 345-6789',
      location: 'Chicago, IL',
      profileImage: 'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=400',
      status: 'blocked',
      appointmentCount: 5,
      joinedDate: '2023-03-10',
      lastLogin: '2024-01-15',
    },
    {
      id: 4,
      name: 'David Brown',
      email: 'david.brown@email.com',
      phone: '+1 (555) 456-7890',
      location: 'Houston, TX',
      profileImage: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=400',
      status: 'active',
      appointmentCount: 15,
      joinedDate: '2023-04-05',
      lastLogin: '2024-01-21',
    },
    {
      id: 5,
      name: 'Emma Johnson',
      email: 'emma.johnson@email.com',
      phone: '+1 (555) 567-8901',
      location: 'Phoenix, AZ',
      profileImage: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400',
      status: 'active',
      appointmentCount: 3,
      joinedDate: '2023-05-12',
      lastLogin: '2024-01-18',
    },
    {
      id: 6,
      name: 'Frank Miller',
      email: 'frank.miller@email.com',
      phone: '+1 (555) 678-9012',
      location: 'Philadelphia, PA',
      profileImage: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400',
      status: 'active',
      appointmentCount: 7,
      joinedDate: '2023-06-08',
      lastLogin: '2024-01-17',
    },
  ];

  const filteredUsers = users.filter(user => {
    const matchesFilter = filter === 'all' || user.status === filter;
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.phone.includes(searchTerm);
    return matchesFilter && matchesSearch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleToggleStatusClick = (user: User) => {
    setConfirmationModal({
      isOpen: true,
      type: user.status === 'active' ? 'block' : 'unblock',
      user: user
    });
  };

  const handleDeleteClick = (user: User) => {
    setConfirmationModal({
      isOpen: true,
      type: 'delete',
      user: user
    });
  };

  const handleConfirmAction = async () => {
    if (!confirmationModal.user) return;
    
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log(`${confirmationModal.type} user:`, confirmationModal.user.id);
    
    setIsLoading(false);
    setConfirmationModal({ isOpen: false, type: 'block', user: null });
    setIsModalOpen(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">Active</Badge>;
      case 'blocked':
        return <Badge variant="danger">Blocked</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const getConfirmationMessage = () => {
    if (!confirmationModal.user) return '';
    
    switch (confirmationModal.type) {
      case 'block':
        return `Are you sure you want to block ${confirmationModal.user.name}? They will no longer be able to access the platform.`;
      case 'unblock':
        return `Are you sure you want to unblock ${confirmationModal.user.name}? They will regain access to the platform.`;
      case 'delete':
        return `Are you sure you want to permanently delete ${confirmationModal.user.name}? This action cannot be undone.`;
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">User Management</h1>
        <p className="text-slate-600 mt-2">View, search, filter, and manage all registered users.</p>
      </div>

      {/* Filters and Search */}
      <GlassCard className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-slate-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
            >
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
            </select>
          </div>
        </div>
      </GlassCard>

      {/* Users Table */}
      <GlassCard>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200/50">
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700">User</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700">Contact</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700">Location</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700">Status</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700">Appointments</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-slate-200/30 hover:bg-white/50 transition-colors duration-200"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <img
                        src={user.profileImage}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium text-slate-800">{user.name}</p>
                        <p className="text-sm text-slate-600">Joined {user.joinedDate}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm">
                      <p className="text-slate-800">{user.email}</p>
                      <p className="text-slate-600">{user.phone}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-600">{user.location}</td>
                  <td className="py-4 px-6">{getStatusBadge(user.status)}</td>
                  <td className="py-4 px-6">
                    <div className="text-sm">
                      <p className="font-medium text-slate-800">{user.appointmentCount}</p>
                      <p className="text-slate-600">appointments</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={Eye}
                        onClick={() => handleViewDetails(user)}
                      >
                        View
                      </Button>
                      <Button
                        variant={user.status === 'active' ? 'danger' : 'success'}
                        size="sm"
                        icon={user.status === 'active' ? Ban : UserCheck}
                        onClick={() => handleToggleStatusClick(user)}
                      >
                        {user.status === 'active' ? 'Block' : 'Activate'}
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        icon={Trash2}
                        onClick={() => handleDeleteClick(user)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Pagination */}
      <GlassCard className="p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-600">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredUsers.length)} of {filteredUsers.length} users
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              icon={ChevronLeft}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 text-sm rounded-lg transition-colors duration-200 ${
                  currentPage === page
                    ? 'bg-blue-500 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {page}
              </button>
            ))}
            <Button
              variant="ghost"
              size="sm"
              icon={ChevronRight}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </GlassCard>

      {/* User Details Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`User Details - ${selectedUser?.name}`}
        size="lg"
      >
        {selectedUser && (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <img
                src={selectedUser.profileImage}
                alt={selectedUser.name}
                className="w-20 h-20 rounded-full object-cover"
              />
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-slate-800">{selectedUser.name}</h3>
                <p className="text-slate-600">{selectedUser.location}</p>
                <div className="flex items-center space-x-4 mt-2">
                  {getStatusBadge(selectedUser.status)}
                  <span className="text-sm text-slate-500">Last login: {selectedUser.lastLogin}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-slate-800 mb-3">Contact Information</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Email:</span> {selectedUser.email}</p>
                  <p><span className="font-medium">Phone:</span> {selectedUser.phone}</p>
                  <p><span className="font-medium">Location:</span> {selectedUser.location}</p>
                  <p><span className="font-medium">Joined:</span> {selectedUser.joinedDate}</p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-slate-800 mb-3">Activity</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Total Appointments:</span> {selectedUser.appointmentCount}</p>
                  <p><span className="font-medium">Account Status:</span> {selectedUser.status}</p>
                  <p><span className="font-medium">Last Login:</span> {selectedUser.lastLogin}</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-lg p-4">
              <h4 className="font-semibold text-slate-800 mb-2">Recent Activity</h4>
              <div className="space-y-2 text-sm text-slate-600">
                <p>• Booked appointment with Dr. Sarah Johnson - Corporate Law</p>
                <p>• Completed consultation session</p>
                <p>• Updated profile information</p>
                <p>• Logged in from {selectedUser.location}</p>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
              <Button
                variant={selectedUser.status === 'active' ? 'danger' : 'success'}
                onClick={() => handleToggleStatusClick(selectedUser)}
              >
                {selectedUser.status === 'active' ? 'Block User' : 'Activate User'}
              </Button>
              <Button
                variant="danger"
                onClick={() => handleDeleteClick(selectedUser)}
              >
                Delete User
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={() => setConfirmationModal({ isOpen: false, type: 'block', user: null })}
        onConfirm={handleConfirmAction}
        type={confirmationModal.type}
        title={`${confirmationModal.type === 'block' ? 'Block' : confirmationModal.type === 'unblock' ? 'Unblock' : 'Delete'} User`}
        message={getConfirmationMessage()}
        isLoading={isLoading}
      />

      {/* Empty State */}
      {filteredUsers.length === 0 && (
        <GlassCard className="p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserCheck className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">No users found</h3>
            <p className="text-slate-600">
              {searchTerm || filter !== 'all' 
                ? 'No users match your current filters. Try adjusting your search criteria.'
                : 'No users have been registered yet.'
              }
            </p>
          </div>
        </GlassCard>
      )}
    </div>
  );
};

export default UserListing;