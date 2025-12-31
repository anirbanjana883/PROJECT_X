import { useState, useEffect } from 'react';
import { api } from './useGetCurrentUser';

export const usePatientHistory = (patientId) => {
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({ 
      totalSessions: 0, 
      avgAccuracy: 0, 
      highestScore: 0 
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!patientId) return;

    const fetchHistory = async () => {
      try {
        const { data } = await api.get('/therapy/history'); 

        const graphData = data.data.map(session => ({
            date: new Date(session.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            score: session.score,
            accuracy: session.accuracy,
            game: session.gameName
        }));

        const total = data.data.length;
        const avgAcc = total > 0 ? data.data.reduce((acc, curr) => acc + curr.accuracy, 0) / total : 0;
        const maxScore = total > 0 ? Math.max(...data.data.map(s => s.score)) : 0;

        setHistory(graphData);
        setStats({
            totalSessions: total,
            avgAccuracy: Math.round(avgAcc),
            highestScore: maxScore
        });

      } catch (err) {
        console.error("Failed to load history", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [patientId]);

  return { history, stats, loading };
};