import React, { createContext, useContext, useState, useEffect } from "react";
import globalConstants from "../const/globalConstants";
import { useUserLog } from "./UserLogContext";
import { getToken } from "../utils/authStorage";
import { useWebSocket } from "./WebSocketContext";

// Crear el contexto
const ServicesContext = createContext();

// Proveedor del contexto
export const ServicesProvider = ({ children }) => {
  const [servicesHistory, setServicesHistory] = useState(null);
  const [servicesRequest, setServiceRequest] = useState(null);
  const [confirmedServices, setConfirmedServices] = useState(null);
  const { userLog } = useUserLog();
  const socket = useWebSocket();

  useEffect(() => {
    if (!userLog) {
      return;
    }
    fetchServices();
  }, [userLog]);

  // actualizo los servicios cuando me lo indiquen desde el socket
  useEffect(() => {
    const actualizarEstados = async () => {
      fetchServices();
    };
    // Vinculamos el evento del socket dentro del useEffect
    if (!socket) return;
    socket.on("refreshServices", actualizarEstados);
    

    // Cleanup para eliminar el evento cuando se desmonte el componente o cambie socket
    return () => socket.off("refreshServices", actualizarEstados);
  }, [socket]);

  // Funcion para hacer un fetch y cargar los servicios
  const fetchServices = async () => {
    try {
      const apiUrl = `${globalConstants.URL_BASE}/services/client/${userLog.id}`;
      const token = await getToken();

      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      const services = data.body;

      const today = new Date();
      today.setHours(today.getHours() - 3);
      const fecha = today.toISOString().split("T")[0];



      // filtro los servicios que tengan el campo aceptado en true
      const confirmedServices = services.filter(
        (service) => service.aceptado === true && service.finalizado === false && service.fecha >= fecha,
      );

      // filtro los servicios que tengan el campo aceptado en false
      const serviceRequests = services.filter(
        (service) => service.aceptado === false && service.fecha >= fecha,
      );

      // filtro los servicios que tengan el campo aceptado en false
      const servicesHistory = services.filter(
        (service) => service.finalizado === true,
      );

      setConfirmedServices(confirmedServices);
      setServiceRequest(serviceRequests);
      setServicesHistory(servicesHistory);
    } catch (error) {
      console.error("Error al obtener los servicios:", error);
    }
  };

  

  // funcion para eliminar un servicio sin comenzar
  const cancelService = async (id, fecha, walkerId) => {
    try {
      const apiUrl = `${globalConstants.URL_BASE}/services/${id}`;
      const token = await getToken();

      const response = await fetch(apiUrl, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          execUserType: "client",
          userId: walkerId,
          fecha: fecha,
          nombreCliente: userLog.nombre_usuario,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error al eliminar el servicio: ${response.status}`);
      }

      // elimino manualmente el servicio del estado
      const newServices = confirmedServices.filter(
        (service) => service.id !== id,
      );
      setConfirmedServices(newServices);
      const newServicesRequest = servicesRequest.filter(
        (service) => service.id !== id,
      );
      setServiceRequest(newServicesRequest);
    } catch (error) {
      console.error("Error al eliminar el servicio:", error);
    }
  };

  const markAsReviewed = async (serviceId) => {
    // Crear un nuevo array con los objetos actualizados
    const newServicesHistory = servicesHistory.map(
      (service) =>
        service.id === serviceId
          ? { ...service, calificado_x_cliente: true } // Crear un nuevo objeto actualizado
          : service, // Dejar los demás sin cambios
    );

    setServicesHistory(newServicesHistory); // Actualizar el estado
  };

  return (
    <ServicesContext.Provider
      value={{
        servicesHistory,
        confirmedServices,
        servicesRequest,
        fetchServices,
        cancelService,
        markAsReviewed,
      }}
    >
      {children}
    </ServicesContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useServices = () => {
  const context = useContext(ServicesContext);

  if (!context) {
    throw new Error("useServices debe usarse dentro de un ServicesProvider");
  }

  return context;
};
