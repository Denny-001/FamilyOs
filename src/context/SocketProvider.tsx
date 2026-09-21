import { createContext, ReactNode } from 'react';

interface SocketContextValue {
  /* future: hold a shared socket instance */
}
export const SocketContext = createContext<SocketContextValue>({});

export const SocketProvider = ({ children }: { children: ReactNode }) => (
  <SocketContext.Provider value={{}}>{children}</SocketContext.Provider>
);