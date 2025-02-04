import React, { createContext, useState, useContext, useEffect } from "react";
import { useUserLog } from "../contexts/UserLogContext";
import { useTurns } from "./TurnsContext";
import { useWebSocket } from "../contexts/WebSocketContext";
import * as Location from "expo-location";

const WalkerLocationContext = createContext();

export const WalkerLocationProvider = ({ children }) => {
  const [walkerLocation, setWalkerLocation] = useState([]);
  const { turns } = useTurns();
  const { userLog } = useUserLog();
  const [activeTurnId, setActiveTurnId] = useState(null);
  const [watchId, setWatchId] = useState(null);
  const socket = useWebSocket();
  const [listening, setListening] = useState(false);

  useEffect(() => {
  }, [walkerLocation]);

  const startListening = () => {
    setListening(true);
  };

  const stopListening = () => {
    setListening(false);
  };

  // Función para emitir eventos de WebSocket
  const emitSocketEvent = (eventName, data) => {
    if (socket && socket.connected) {
      // Asegurarse que el socket esté conectado
      socket.emit(eventName, data);
    } else {
      console.warn(
        "Socket de ubicación no está conectado, no se puede emitir el evento:",
        eventName,
      );
    }
  };

  useEffect(() => {
    return () => {
      stopWatchingLocation();
    };
  }, []);

  const startWatchingLocation = async (roomName) => {
    try {
      stopWatchingLocation(); // Detener si ya hay uno en marcha

      // Pedir permisos de ubicación
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        throw new Error("Permiso de ubicación denegado");
      }

      // Iniciar seguimiento de ubicación en tiempo real
      const id = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 30000, // Actualizar cada 30 segundos
          distanceInterval: 50,
        },
        (location) => {
          const coords = [location.coords.latitude, location.coords.longitude];
          setWalkerLocation(coords);

          // Emitir la ubicación al servidor
          emitSocketEvent("newLocation", {
            roomName,
            lat: coords[0],
            long: coords[1],
            walkerId: userLog.id,
          });
        },
      );

      setWatchId(id);
    } catch (error) {
      console.error("Error al iniciar la observación de la ubicación:", error);
    }
  };

  const stopWatchingLocation = () => {
    if (watchId) {
      watchId.remove(); // Cancelar la suscripción de ubicación
      setWatchId(null); // Resetear el estado
    }
  };

  useEffect(() => {
    if (userLog) {
      const activeTurn = turns.find((turn) =>
        turn.Services.some(
          (service) => service.comenzado && !service.finalizado,
        ),
      );

      if (activeTurn) {
        // Si el turno activo ha cambiado, únete a una nueva sala
        if (activeTurn.id !== activeTurnId) {
          if (activeTurnId) {
            const roomName = `turn_service_${activeTurnId}`;
            emitSocketEvent("leaveRoom", { roomName, userId: userLog.id });
          }

          const newRoomName = `turn_service_${activeTurn.id}`;
          emitSocketEvent("createRoom", { newRoomName, userId: userLog.Id });

          setActiveTurnId(activeTurn.id);

          // Inicia la observación de la ubicación solo si hay un turno activo
          stopWatchingLocation(); // Asegura que no haya otra observación corriendo
          startWatchingLocation(newRoomName);
        }
      } else {
        // Si no hay un turno activo, dejar la sala y detener la observación de la ubicación
        if (activeTurnId) {
          const roomName = `turn_service_${activeTurnId}`;
          emitSocketEvent("leaveRoom", { roomName, userId: userLog.id });
          setActiveTurnId(null);
          stopWatchingLocation();
        }
      }
    }

    // El return solo detiene la observación al desmontar el componente
    return () => {
      stopWatchingLocation();
    };
  }, [turns, userLog]); // Solo se ejecuta cuando cambian los turnos o el tipo de usuario

  return (
    <WalkerLocationContext.Provider
      value={{
        walkerLocation,
        setWalkerLocation,
        startListening,
        stopListening,
      }}
    >
      {children}
    </WalkerLocationContext.Provider>
  );
};

// Hook para acceder a la ubicación del paseador
export const useWalkerLocation = () => {
  const context = useContext(WalkerLocationContext);
  if (!context) {
    throw new Error(
      "useWalkerLocation debe usarse dentro de un WalkerLocationProvider",
    );
  }
  return context;
};
