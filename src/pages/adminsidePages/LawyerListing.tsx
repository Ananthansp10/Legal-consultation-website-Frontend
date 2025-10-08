import React, { useEffect, useState } from "react";
import { getLawyers } from "../../services/admin/lawyerListingService";
import DataTable from "../../components/reusableComponents/DataTable";

interface Lawyer {
  _id: string;
  name: string;
  email: string;
  status: boolean;
}

const LawyerListing: React.FC = () => {
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;
  const [totalPages, setTotalPages] = useState(0);
  const startIndex = (currentPage - 1) * itemsPerPage;

  function fetchLawyer() {
    getLawyers(startIndex, itemsPerPage).then((response) => {
      setLawyers(response.data.data);
      setTotalPages(Math.ceil(response.data.totalData / itemsPerPage));
    });
  }

  useEffect(() => {
    fetchLawyer();
  }, [currentPage]);

  return (
    <div>
      <DataTable
        title="Lawyers Management"
        subtitle="Manage and view Lawyers"
        data={lawyers}
        type="lawyer"
        fetchData={fetchLawyer}
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        startIndex={startIndex}
      />
    </div>
  );
};

export default LawyerListing;
