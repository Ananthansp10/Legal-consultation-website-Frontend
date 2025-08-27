type UserStatus = 'active' | 'blocked';
import React, { useState, useEffect } from 'react';
import { getUsers} from '../../services/admin/userListingService';
import DataTable from '../../components/reusableComponents/DataTable';
import Pagination from '../../components/reusableComponents/Pagination';

interface User {
  _id: string;
  name: string;
  email: string;
  phoneNumber: number;
  status: boolean;
  createdAt: Date;
  profileImage?: string;
  userStatus?: UserStatus;
  joinedDate?: string;
}

const UserListing: React.FC = () => {
  const [users, setUsers] = useState<User[]>([])

  function fetchUsers(){
    getUsers().then((response)=>{
      setUsers(response.data.data)
    })
  }

  useEffect(()=>{
    fetchUsers()
  },[])

  return (
    <div>
      <DataTable title='Users Manangement' subtitle='Manage and view users' data={users} type='user' fetchData={fetchUsers} />
    </div>

  );
};

export default UserListing;