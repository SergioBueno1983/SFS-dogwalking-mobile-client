import React, { createContext, useContext, useEffect, useState } from "react";
import globalConstants from "../const/globalConstants";
import { useUserLog } from "./UserLogContext";
import { getToken } from "../utils/authStorage";

// Crear el contexto
const TurnsContext = createContext();

// Proveedor del contexto
export const TurnsProvider = ({ children }) => {
  const [turns, setTurns] = useState([]);
  const [cargado, setCargado] = useState(false);
  const { userLog } = useUserLog();

  useEffect(() => {
    if (!userLog) {
      return;
    }
    fetchTurns();
  }, [userLog]);

  // Funcion para hacer un fetch y cargar los turnos
  const fetchTurns = async () => {
    try {
      const apiUrl = `${globalConstants.URL_BASE}/turns/walker/${userLog.id}`;
      const token = await getToken();
      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setTurns(data.body);
      setCargado(true);
    } catch (error) {
      console.error("Error al obtener los turnos:", error);
    }
  };

  const addTurn = async (turn) => {
    try {
      const apiUrl = `${globalConstants.URL_BASE}/turns`;
      const token = await getToken();

      // creo el turn en la api
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(turn),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(`Error al crear turno: ${data.message}`);
      }

      // agrego el turno creado al estado
      setTurns([...turns, data.data]);

      return true;
    } catch (error) {
      console.error("Error al crear turno:", error);
      return false;
    }
  };

  const editTurn = async (turn) => {
    try {
      const apiUrl = `${globalConstants.URL_BASE}/turns/${turn.id}`;
      const token = await getToken();


      // creo el turn en la api
      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(turn),
      });


      const data = await response.json();

      if (!response.ok) {
        throw new Error(`Error al editar turno: ${data.message}`);
      }

      // actualizo el turno en el estado
      const newTurns = turns.map((t) => {
        if (t.id === turn.id) {
          return data.body;
        }
        return t;
      });
      setTurns(newTurns);

      return true;
    } catch (error) {
      console.error("Error al editar turno:", error);
      return false;
    }
  };

  // funcion para eliminar un turno
  const deleteTurn = async (id) => {
    try {
      const apiUrl = `${globalConstants.URL_BASE}/turns/${id}`;
      const token = await getToken();
      const response = await fetch(apiUrl, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error al eliminar el turno: ${response.status}`);
      }

      // elimino manualmente el turno del estado
      const newTurns = turns.filter((turn) => turn.id !== id);
      setTurns(newTurns);
      return true;
    } catch (error) {
      console.error("Error al eliminar el turno:", error);
      return false;
    }
  };

  return (
    <TurnsContext.Provider
      value={{
        turns,
        setTurns,
        fetchTurns,
        deleteTurn,
        addTurn,
        cargado,
        editTurn,
      }}
    >
      {children}
    </TurnsContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useTurns = () => {
  const context = useContext(TurnsContext);

  if (!context) {
    throw new Error("useTurns debe usarse dentro de un TurnsProvider");
  }

  return context;
};
