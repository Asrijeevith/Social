// hooks/useStoriesFeed.ts
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store'; // adjust path if needed

export function useStoriesFeed() {
  const { isAuthenticated, token } = useSelector(
    (state: RootState) => state.auth,
  );

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated || !token) {
        setError(new Error('No token available'));
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get('http://192.168.0.111:8080/stories/feed', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setData(res.data);
      } catch (err: any) {
        console.error('Error fetching stories feed:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, token]);

  return { data, loading, error };
}
