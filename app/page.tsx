'use client';

import { useEffect, useState } from 'react';

interface DataItem {
  id: number;
  value: number;
  timestamp: number;
}

export default function Home() {
  const [data, setData] = useState<Record<number, DataItem>>({});

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');

    ws.onmessage = (event) => {
      const updates: DataItem[] = JSON.parse(event.data);

      setData((prev) => {
        const newData = { ...prev };
        updates.forEach((u) => {
          newData[u.id] = u;
        });

        return newData;
      });
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div>
      <h1>Realtime Dashboard</h1>
      <div className='h-full overflow-y-auto'>
        {Object.values(data).map((item) => (
          <div key={item.id}>
            {item.id}: {item.value.toFixed(2)}
          </div>
        ))}
      </div>
    </div>
  );
}
