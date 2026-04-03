import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

console.log('WebSocket server running on ws://localhost:8080');

wss.on('connection', (ws) => {
  console.log('Client connected');

  // simulate high-frequency data
  const interval = setInterval(() => {
    const updates = [];

    for (let i = 0; i < 100; i++) {
      updates.push({
        id: Math.floor(Math.random() * 1000),
        value: Math.random() * 100,
        timestamp: Date.now(),
      });
    }

    ws.send(JSON.stringify(updates));
  }, 50); // every 50ms

  ws.on('close', () => {
    clearInterval(interval);
    console.log('Client disconnected');
  });
});
