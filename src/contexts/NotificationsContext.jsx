// contexts/NotificationsContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react";
import { useUserLog } from "./UserLogContext";
import { getToken } from "../utils/authStorage";
import globalConstants from "../const/globalConstants";
import { useWebSocket } from "./WebSocketContext";

const NotificationsContext = createContext();

export const useNotificationsContext = () => useContext(NotificationsContext);

export const NotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const { userLog } = useUserLog();
  const socket = useWebSocket();

  useEffect(() => {
    const agregarNotification = async (notification) => {
      if (notification.userId !== userLog.id) return;
      setNotifications((prevNotifications) => [
        notification,
        ...prevNotifications,
      ]);
    };
    // Vinculamos el evento del socket dentro del useEffect
    if (!socket) return;
    socket.on("notification", agregarNotification);

    // Cleanup para eliminar el evento cuando se desmonte el componente o cambie socket
    return () => socket.off("notification", agregarNotification);
  }, [socket]);

  useEffect(() => {
    // Función para cargar notificaciones del usuario
    const loadNotifications = async () => {
      try {
        const token = await getToken();

        const response = await fetch(
          `${globalConstants.URL_BASE}/notifications/${userLog.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (!response.ok) {
          throw new Error("Error al obtener las notificaciones");
        }
        const data = await response.json();

        // Ordenar las notificaciones por fecha, las más recientes primero
        const sortedNotifications = data.sort(
          (a, b) => new Date(b.fechaHora) - new Date(a.fechaHora),
        );

        setNotifications(sortedNotifications);
      } catch (error) {
        console.error("Error al cargar las notificaciones:", error);
      }
    };

    if (userLog?.id) {
      loadNotifications();
    }
  }, [userLog]);

  useEffect(() => {}, [notifications]);

  // Función para agregar una notificación
  const addNotification = async (notification) => {
    try {
      const token = await getToken();

      const response = await fetch(
        `${globalConstants.URL_BASE}/notifications`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(notification),
        },
      );
      const newNotification = await response.json();
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        newNotification,
      ]);
    } catch (error) {
      console.error("Error al agregar la notificación:", error);
    }
  };

  // Función para marcar una notificación como leída
  const markAsRead = async (notificationId) => {
    try {
      const token = await getToken();
      const notification = notifications.find((n) => n.id === notificationId);

      if (notification) {
        const response = await fetch(
          `${globalConstants.URL_BASE}/notifications/${notificationId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ ...notification, leido: true }),
          },
        );
        if (response.ok) {
          setNotifications((prevNotifications) =>
            prevNotifications.map((n) =>
              n.id === notificationId ? { ...n, leido: true } : n,
            ),
          );
        }
      }
    } catch (error) {
      console.error("Error al marcar la notificación como leída:", error);
    }
  };

  return (
    <NotificationsContext.Provider
      value={{ notifications, addNotification, markAsRead }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};
