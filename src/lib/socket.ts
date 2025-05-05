'use client'
// socket.ts
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const getSocket = (userId: string) => {
  if (!socket) {
    socket = io('https://vision-board-backend-1.onrender.com', {
      query: { userId },
    });
  }
  return socket;
};
