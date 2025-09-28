import { useEffect, useState } from 'react';
import AdminHeader from '../../components/admin/AdminHeader';
import SpecializationCard from '../../components/admin/SpecializationCard';
import AddSpecializationModal from '../../components/admin/AddSpecializationModal';
import EmptyState from '../../components/admin/EmptyState';
import { getSpecialization } from '../../services/admin/adminService';
import Pagination from '../../components/reusableComponents/Pagination';

function SpecializationPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [specializations, setSpecializations] = useState<Array<{ _id: string, name: string, description: string }>>([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 4
  const startIndex = (currentPage - 1) * itemsPerPage
  const [totalPages, setTotalPages] = useState(0)

  function fetchSpecialization() {
    getSpecialization(startIndex, itemsPerPage).then((response) => {
      setSpecializations(response.data.data)
      setTotalPages(Math.ceil(response.data.totalSpecialization / itemsPerPage))
    })
  }

  useEffect(() => {
    fetchSpecialization()
  }, [isModalOpen, currentPage])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/60 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-blue-600/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl" />
      </div>

      <main className="relative z-10 p-8 lg:p-12">
        <AdminHeader onAddClick={() => setIsModalOpen(true)} />

        {specializations.length === 0 ? (
          <EmptyState onAddClick={() => setIsModalOpen(true)} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
            {specializations.map((specialization, index) => (
              <SpecializationCard
                key={index}
                specId={specialization?._id}
                name={specialization?.name}
                description={specialization?.description}
                handleChange={fetchSpecialization}
              />
            ))}
          </div>
        )}
      </main>

      <AddSpecializationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  );
}

export default SpecializationPage