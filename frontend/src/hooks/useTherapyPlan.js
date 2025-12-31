import { useState, useEffect } from 'react';
import { api } from './useGetCurrentUser'; 

export const useTherapyPlan = (patientId) => {
  const [plan, setPlan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!patientId) return;

    const fetchPlan = async () => {
      try {
        const { data } = await api.get(`/therapy/active/${patientId}`);
        setPlan(data); 
      } catch (err) {
        console.error("Failed to load therapy plan", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [patientId]);

  return { plan, loading, error };
};