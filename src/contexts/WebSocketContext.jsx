import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useUserLog } from './UserLogContext';
import globalConstants from '../const/globalConstants';

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { userLog } = useUserLog();

  useEffect(() => {
    if (userLog) {
      // Solo conectarse cuando el usuario esté logueado
      const newSocket = io(globalConstants.SOCKET_URL, {
        transports: ['websocket'],
        auth:{
          userId: userLog.id
        }
      });

      // Autenticar al usuario logueado en WebSocket
      newSocket.emit('authenticate', userLog.id);

      setSocket(newSocket);

      // Limpiar la conexión cuando el usuario se desconecta o cierre sesión
      return () => {
        newSocket.close();
      };
    }
  }, [userLog]);

  return (
    <WebSocketContext.Provider value={socket}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  return useContext(WebSocketContext);
};
