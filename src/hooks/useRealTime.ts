import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../store/authStore';

let socket: Socket | null = null;

export const useRealTime = (familyId?: string, handlers?: Record<string, (d: unknown) => void>) => {
  const token = useAuthStore((s) => s.accessToken);

  useEffect(() => {
    if (!token) return;
    socket = io('/', { auth: { token }, transports: ['websocket'] });

    if (familyId) socket.emit('family:join', familyId);

    if (handlers) {
      Object.entries(handlers).forEach(([evt, fn]) => socket!.on(evt, fn));
    }

    return () => {
      if (familyId) socket?.emit('family:leave', familyId);
      socket?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, familyId]);

  return socket;
};