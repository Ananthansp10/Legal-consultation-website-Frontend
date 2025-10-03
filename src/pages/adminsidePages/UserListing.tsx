type UserStatus = "active" | "blocked";
import React, { useState, useEffect } from "react";
import { getUsers } from "../../services/admin/userListingService";
import DataTable from "../../components/reusableComponents/DataTable";

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
  const [users, setUsers] = useState<User[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;
  const [totalPages, setTotalPages] = useState(0);
  const startIndex = (currentPage - 1) * itemsPerPage;

  function fetchUsers() {
    getUsers(startIndex, itemsPerPage).then((response) => {
      setUsers(response.data.data);
      setTotalPages(Math.ceil(response.data.totalData / itemsPerPage));
    });
  }

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  return (
    <div>
      <DataTable
        title="Users Manangement"
        subtitle="Manage and view users"
        data={users}
        type="user"
        fetchData={fetchUsers}
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        startIndex={startIndex}
      />
    </div>
  );
};

export default UserListing;
