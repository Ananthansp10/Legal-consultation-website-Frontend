import React, { useEffect, useState } from 'react';
import { getLawyers} from '../../services/admin/lawyerListingService';
import DataTable from '../../components/reusableComponents/DataTable';
import Pagination from '../../components/reusableComponents/Pagination';

interface Lawyer {
  _id: string;
  name: string;
  email: string;
  status: boolean;
}

const LawyerListing: React.FC = () => {

  const [lawyers,setLawyers]=useState<Lawyer[]>([])

  
  function fetchLawyer(){
    getLawyers().then((response)=>{
      setLawyers(response.data.data)
    })
  }

  useEffect(()=>{
    fetchLawyer()
  },[])

  return (
    <div>
      <DataTable title='Lawyers Management' subtitle='Manage and view Lawyers' data={lawyers} type='lawyer' fetchData={fetchLawyer}/>
    </div>
  );
};

export default LawyerListing;
