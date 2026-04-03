'use client';

import { useEffect, useRef, useState } from 'react';

interface DataItem {
  id: number;
  value: number;
  timestamp: number;
}

export default function Home() {
  const [data, setData] = useState<Record<number, DataItem>>({});
  const bufferRef = useRef<Record<number, DataItem>>({});

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');

    ws.onmessage = (event) => {
      const updates: DataItem[] = JSON.parse(event.data);
      // reformat updates data array into map
      updates.forEach((u) => {
        bufferRef.current[u.id] = u;
      });
    };

    // re-render every 500ms with latest data in buffer
    const interval = setInterval(() => {
      const pending = bufferRef.current;
      if (Object.keys(pending).length === 0) {
        return;
      }
      // pending overwrites previous data with same id
      setData((prev) => ({ ...prev, ...pending }));
      bufferRef.current = {};
    }, 500);

    return () => {
      ws.close();
      clearInterval(interval);
    };
  }, []);

  return (
    <div>
      <h1>Realtime Dashboard</h1>
      <div className='h-full overflow-y-auto'>
        {Object.values(data).map((item) => (
          <div key={item.id}>
            {item.id}: {item.value.toFixed(2)} (at{' '}
            {new Date(item.timestamp).toLocaleTimeString()})
          </div>
        ))}
      </div>
    </div>
  );
}
