import { useState, useEffect } from 'react';
import { api } from './useGetCurrentUser'; 

export const useTherapyPlan = (patientId) => { // patientId is actually not needed for the URL anymore
  const [plan, setPlan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Safety check: Don't run if we aren't logged in/don't have an ID context
    if (!patientId) return; 

    const fetchPlan = async () => {
      try {
        setLoading(true);

        // ❌ OLD (Caused 404): 
        // const { data } = await api.get(`/therapy/active/${patientId}`);

        // ✅ NEW (Correct):
        // The backend finds the user via the HTTP-Only Cookie/Token
        const response = await api.get('/therapy/my-plan');
        
        // Handle response structure { success: true, data: [...] }
        setPlan(response.data.data || []); 

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