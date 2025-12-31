import { useState, useEffect } from 'react';
import { api } from './useGetCurrentUser'; 

export const useMyPatients = () => {
  const [patients, setPatients] = useState([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await api.get('/auth/my-patients'); 
        
        console.log("API Response:", response.data); // Debug log

        if (Array.isArray(response.data)) {
            setPatients(response.data);
        } else if (response.data && Array.isArray(response.data.data)) {
            setPatients(response.data.data); 
        } else {
            setPatients([]); 
        }

      } catch (err) {
        console.error("Failed to load patients", err);
        setPatients([]); 
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  return { patients, loading };
};