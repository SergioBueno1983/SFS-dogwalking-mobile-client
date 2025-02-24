// contexts/ServicesContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react";
import { useWebSocket } from "./WebSocketContext";

const LocationContext = createContext();

export const useLocationContext = () => useContext(LocationContext);

export const LocationProvider = ({ children }) => {
  const [walkerLocation, setWalkerLocation] = useState([]);
  const socket = useWebSocket();

  useEffect(() => {
    const setearWalkerLocation = async (location) => {
      setWalkerLocation(location);
    };
    // Vinculamos el evento del socket dentro del useEffect
    if (!socket) return;
    socket.on('receiveLocation', (location) => {
      setWalkerLocation([location.lat, location.long]);
    });

    // Cleanup para eliminar el evento cuando se desmonte el componente o cambie socket
    return () => socket.off("receiveLocation", setearWalkerLocation);
  }, [socket]);

  const resetWalkerLocation = () => {
    setWalkerLocation([]);
  };

  return (
    <LocationContext.Provider
      value={{
        walkerLocation,
        resetWalkerLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};
