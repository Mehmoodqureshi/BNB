#!/usr/bin/env node

// Development WebSocket server
// Run this alongside your Next.js app for real-time messaging

import { createDevelopmentServer } from '../lib/websocket/setup.js';

console.log('Starting WebSocket server for development...');
console.log('Make sure to set NEXT_PUBLIC_WS_URL=http://localhost:3001 in your .env.local');

const { httpServer, io } = createDevelopmentServer(3001);

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down WebSocket server...');
  httpServer.close(() => {
    console.log('WebSocket server closed');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('\nShutting down WebSocket server...');
  httpServer.close(() => {
    console.log('WebSocket server closed');
    process.exit(0);
  });
});
