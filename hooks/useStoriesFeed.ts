// hooks/useStoriesFeed.ts
import { useEffect, useState } from 'react';

export function useStoriesFeed() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jsonData =[
  {
    "user_id": 2,
    "username": "maria",
    "profile_pic": "https://picsum.photos/id/1011/200/200",
    "stories": [
      {
        "id": 201,
        "media_url": "https://picsum.photos/id/1015/1080/1920",
        "media_type": "image",
        "seen": true,
        "created_at": "2025-08-21T20:45:12.000Z" // Aug 22, 2:15:12 AM IST
      },
      {
        "id": 202,
        "media_url": "https://picsum.photos/id/1016/1080/1920",
        "media_type": "image",
        "seen": true,
        "created_at": "2025-08-22T05:22:30.000Z" // Aug 22, 10:52:30 AM IST
      }
    ],
    "all_seen": true
  },
  {
    "user_id": 3,
    "username": "john",
    "profile_pic": "https://picsum.photos/id/1012/200/200",
    "stories": [
      {
        "id": 301,
        "media_url": "https://picsum.photos/id/1018/1080/1920",
        "media_type": "image",
        "seen": true,
        "created_at": "2025-08-21T23:10:50.000Z" // Aug 22, 4:40:50 AM IST
      },
      {
        "id": 302,
        "media_url": "https://picsum.photos/id/1019/1080/1920",
        "media_type": "image",
        "seen": false,
        "created_at": "2025-08-22T15:35:20.000Z" // Aug 22, 9:05:20 PM IST
      }
    ],
    "all_seen": false
  },
  {
    "user_id": 4,
    "username": "lisa",
    "profile_pic": "https://picsum.photos/id/1013/200/200",
    "stories": [
      {
        "id": 401,
        "media_url": "https://picsum.photos/id/1020/1080/1920",
        "media_type": "image",
        "seen": false,
        "created_at": "2025-08-23T02:15:45.000Z" // Aug 23, 7:45:45 AM IST
      },
      {
        "id": 402,
        "media_url": "https://picsum.photos/id/1021/1080/1920",
        "media_type": "image",
        "seen": false,
        "created_at": "2025-08-23T05:50:10.000Z" // Aug 23, 11:20:10 AM IST
      }
    ],
    "all_seen": false
  },
  {
    "user_id": 5,
    "username": "david",
    "profile_pic": "https://picsum.photos/id/1014/200/200",
    "stories": [
      {
        "id": 501,
        "media_url": "https://picsum.photos/id/1022/1080/1920",
        "media_type": "image",
        "seen": true,
        "created_at": "2025-08-22T10:25:33.000Z" // Aug 22, 3:55:33 PM IST
      },
      {
        "id": 502,
        "media_url": "https://picsum.photos/id/1023/1080/1920",
        "media_type": "image",
        "seen": false,
        "created_at": "2025-08-23T00:40:22.000Z" // Aug 23, 6:10:22 AM IST
      }
    ],
    "all_seen": false
  }
];
        

        setData(jsonData);
      } catch (err: any) {
        console.error('Error loading stories feed:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
}
