import React, { useEffect, useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import {
  filterUser,
  searchUser,
  updateUserStatus,
} from "../../services/admin/userListingService";
import { toast } from "react-toastify";
import {
  filterLawyer,
  searchLawyer,
  updateLawyerStatus,
} from "../../services/admin/lawyerListingService";
import Pagination from "./Pagination";
import {
  getLawyerProfile,
  getUserProfile,
} from "../../services/admin/adminService";
import { useNavigate } from "react-router-dom";

interface DataItem {
  _id: string;
  name: string;
  email: string;
  phoneNumber?: number;
  status: boolean;
  createdAt?: Date;
}

interface DataTableProps {
  title: string;
  subtitle: string;
  data: DataItem[];
  type: string;
  fetchData: Function;
  currentPage: number;
  totalPages: number;
  setCurrentPage: any;
  startIndex: number;
}

const DataTable: React.FC<DataTableProps> = ({
  title,
  subtitle,
  data,
  type,
  fetchData,
  currentPage,
  totalPages,
  setCurrentPage,
  startIndex,
}) => {
  const [filteredData, setFilteredData] = useState<DataItem[]>(data);

  const navigate = useNavigate();

  function toggleStatus(id: string, status: string) {
    if (type == "user") {
      updateUserStatus(id, status).then((response) => {
        toast.success(response.data.message);
        fetchData();
      });
    } else {
      updateLawyerStatus(id, status).then((response) => {
        toast.success(response.data.message);
        fetchData();
      });
    }
  }

  const [search, setSearch] = useState("");

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  function searchData() {
    if (type == "user") {
      searchUser(search).then((response) => {
        setFilteredData(response.data.data || []);
      });
    } else {
      searchLawyer(search).then((response) => {
        setFilteredData(response.data.data || []);
      });
    }
  }

  function filter(status: string) {
    if (type == "user") {
      filterUser(
        status == "active" ? "unblock" : status == "inactive" ? "block" : "all",
      ).then((response) => {
        setFilteredData(response.data.data);
      });
    } else {
      filterLawyer(
        status == "active" ? "unblock" : status == "inactive" ? "block" : "all",
      ).then((response) => {
        setFilteredData(response.data.data);
      });
    }
  }

  function getProfile(id: string) {
    if (type == "user") {
      getUserProfile(id).then((response) => {
        navigate("/admin-dashboard/profile-view", {
          state: { profile: response.data.data },
        });
      });
    } else {
      getLawyerProfile(id).then((response) => {
        let data = { ...response.data.data, type: "lawyer" };
        navigate("/admin-dashboard/profile-view", { state: { profile: data } });
      });
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          <p className="mt-2 text-gray-600">{subtitle}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md flex">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  type="text"
                  placeholder="Search by name or email"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-l-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition duration-150 ease-in-out"
                />
              </div>
              <button
                onClick={searchData}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-r-lg text-sm font-medium transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm border border-blue-600"
              >
                Search
              </button>
            </div>

            {/* Filter Dropdown */}
            <div className="relative">
              <select
                onChange={(e) => filter(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition duration-150 ease-in-out min-w-32"
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <ChevronDown className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    S.No
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Block/Unblock
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((item, index) => (
                  <tr
                    key={item._id}
                    className={`hover:bg-gray-50 transition-colors duration-150 ease-in-out ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-25"
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {startIndex + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {item.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{item.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          !item.status
                            ? "bg-green-100 text-green-800 border border-green-200"
                            : "bg-red-100 text-red-800 border border-red-200"
                        }`}
                      >
                        {!item.status ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => getProfile(item._id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm"
                      >
                        View Details
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() =>
                          toggleStatus(
                            item._id,
                            item.status ? "unblock" : "block",
                          )
                        }
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-sm ${
                          !item.status
                            ? "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500"
                            : "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500"
                        }`}
                      >
                        {!item.status ? "Block" : "Unblock"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Table Footer */}
        <div className="bg-white px-6 py-4 border-t border-gray-200 rounded-b-lg">
          <div className="text-sm text-gray-500">
            Showing {filteredData.length}{" "}
            {filteredData.length === 1 ? "entry" : "entries"}
          </div>
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages || 0}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default DataTable;
