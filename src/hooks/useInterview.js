import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:3001/api';

export const useInterview = (roomId) => {
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!roomId) return;

    const fetchInterview = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/interview/room/${roomId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (data.success) {
          setInterview(data.interview);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInterview();
  }, [roomId]);

  return { interview, loading, error };
};
