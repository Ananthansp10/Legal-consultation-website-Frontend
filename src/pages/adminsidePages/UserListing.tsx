type UserStatus = 'active' | 'blocked';

import React, { useState, useEffect } from 'react';
import { Eye, Search, Filter, Ban, ChevronLeft, ChevronRight } from 'lucide-react';
import GlassCard from '../../components/admin/GlassCard';
import Button from '../../components/admin/Button';
import Modal from '../../components/admin/Modal';
import Badge from '../../components/admin/Badge';
import ConfirmationModal from '../../components/admin/ConfirmationModal';
import { getUsers, updateUserStatus } from '../../services/admin/userListingService';
import { toast } from 'react-toastify';

interface User {
  _id: string;
  name: string;
  email: string;
  phoneNumber: number;
  status: boolean;
  createdAt: string;
  profileImage?: string;
  userStatus?: UserStatus;
  joinedDate?: string;
}

const UserListing: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    type: 'block' as 'block' | 'unblock',
    user: null as User | null
  });
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

 

  function fetchUsers(){
    getUsers().then((response)=>{
      const transformedUsers = response.data.data.map((user: any) => ({
        ...user,
        userStatus: user.status ? 'blocked' : 'active',
        joinedDate: new Date(user.createdAt).toLocaleDateString(),
        profileImage: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
      }))
      setUsers(transformedUsers)
    })
  }

  useEffect(()=>{
    fetchUsers()
  },[])

  const filteredUsers = users.filter(user => {
    const matchStatus = filter === 'all' || user.userStatus === filter;
    const matchSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(user.phoneNumber).includes(searchTerm);
    return matchStatus && matchSearch;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleToggleStatusClick = (user: User) => {
    setConfirmationModal({
      isOpen: true,
      type: user.userStatus === 'active' ? 'block' : 'unblock',
      user
    });
  };

  const handleConfirmAction = async () => {
    if (!confirmationModal.user) return;
    setIsLoading(true);

    updateUserStatus(confirmationModal.user._id,confirmationModal.type).then((response:any)=>{
      toast.success(response.data.message)
      fetchUsers()
    }).catch((error)=>{
      toast.error(error.response.data.message)
    })

    setIsLoading(false);
    setConfirmationModal({ isOpen: false, type: 'block', user: null });
    setIsModalOpen(false);
  };

  const getStatusBadge = (status: string) =>
    status === 'active' ? (
      <Badge variant="success">Active</Badge>
    ) : (
      <Badge variant="danger">Blocked</Badge>
    );

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">User Management</h1>
        <p className="text-slate-600 mt-2">
          View, search, filter, and manage all registered users.
        </p>
      </div>

      <GlassCard className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white/50"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-slate-400" />
              <select
                value={filter}
                onChange={e => setFilter(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white/50"
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>
            <select
              value={itemsPerPage}
              onChange={e => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white/50"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      </GlassCard>

      <GlassCard>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200/50">
                <th className="text-left py-4 px-6 text-sm font-semibold">User</th>
                <th className="text-left py-4 px-6 text-sm font-semibold">Email</th>
                <th className="text-left py-4 px-6 text-sm font-semibold">Phone</th>
                <th className="text-left py-4 px-6 text-sm font-semibold">Status</th>
                <th className="text-left py-4 px-6 text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map(user => (
                <tr
                  key={user._id}
                  className="border-b border-slate-200/30 hover:bg-white/50"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <img
                        src={user.profileImage}
                        alt={user.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-slate-500">
                          Joined {user.joinedDate}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm">{user.email}</td>
                  <td className="py-4 px-6 text-sm text-slate-600">
                    {user.phoneNumber ? user.phoneNumber : 'Nill'}
                  </td>
                  <td className="py-4 px-6">{getStatusBadge(user.userStatus!)}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={Eye}
                        onClick={() => handleViewDetails(user)}
                      >
                        View
                      </Button>
                      <Button
                        variant={user.userStatus === 'active' ? 'danger' : 'success'}
                        size="sm"
                        icon={Ban}
                        onClick={() => handleToggleStatusClick(user)}
                      >
                        {user.userStatus === 'active' ? 'Block' : 'Activate'}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      <GlassCard className="p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-600">
            Showing {startIndex + 1} to{' '}
            {Math.min(startIndex + itemsPerPage, filteredUsers.length)} of{' '}
            {filteredUsers.length} users
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              icon={ChevronLeft}
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 text-sm rounded-lg ${
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
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </GlassCard>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`User Details - ${selectedUser?.name}`}
        size="lg"
      >
        {selectedUser && (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <img
                src={selectedUser.profileImage}
                alt={selectedUser.name}
                className="w-20 h-20 rounded-full"
              />
              <div>
                <h3 className="text-xl font-semibold">{selectedUser.name}</h3>
                <p className="text-sm text-slate-500">{selectedUser.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p>
                  <strong>Phone:</strong> {selectedUser.phoneNumber ? selectedUser.phoneNumber : "Nill" }
                </p>
                <p>
                  <strong>Status:</strong> {selectedUser.userStatus}
                </p>
              </div>
              <div>
                <p>
                  <strong>Joined:</strong> {selectedUser.joinedDate}
                </p>
              </div>
            </div>
            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
              <Button
                variant={
                  selectedUser.userStatus === 'active' ? 'danger' : 'success'
                }
                onClick={() => handleToggleStatusClick(selectedUser)}
              >
                {selectedUser.userStatus === 'active'
                  ? 'Block User'
                  : 'Activate User'}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={() =>
          setConfirmationModal({ isOpen: false, type: 'block', user: null })
        }
        onConfirm={handleConfirmAction}
        type={confirmationModal.type}
        title={`${
          confirmationModal.type === 'block' ? 'Block' : 'Unblock'
        } User`}
        message={`Are you sure you want to ${
          confirmationModal.type
        } ${confirmationModal.user?.name}?`}
        isLoading={isLoading}
      />
    </div>
  );
};

export default UserListing;