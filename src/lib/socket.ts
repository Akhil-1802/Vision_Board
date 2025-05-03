'use client'
// socket.ts
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const getSocket = (userId: string) => {
  if (!socket) {
    socket = io('http://localhost:5000', {
      query: { userId },
    });
  }
  return socket;
};
