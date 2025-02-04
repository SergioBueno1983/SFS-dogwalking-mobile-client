import React, { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

// Crear el contexto
const UserLogContext = createContext();

// Proveedor del contexto
export const UserLogProvider = ({ children }) => {
  const [userLog, setUserLog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userLog = async () => {
      try {
        const storedUserLog = await SecureStore.getItemAsync("userLog");
        if (storedUserLog) {
          const parsedUserLog = JSON.parse(storedUserLog);
          setUserLog(parsedUserLog);
        }
      } catch (error) {
        console.error("Error al obtener el userLog:", error);
      } finally {
        setIsLoading(false);
      }
    };

    userLog();
  }, []);

  // Función para iniciar sesión
  const login = async (user) => {
    try {
      await SecureStore.setItemAsync("userLog", JSON.stringify(user));
      setUserLog(user);
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    }
  };

  // Función para cerrar sesión
  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync("userLog");
      setUserLog(null);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  if (isLoading) {
    return null; // Muestra un spinner o una pantalla de carga si prefieres
  }

  return (
    <UserLogContext.Provider value={{ userLog, login, logout, setUserLog }}>
      {children}
    </UserLogContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useUserLog = () => {
  const context = useContext(UserLogContext);

  if (!context) {
    throw new Error("useUserLog debe usarse dentro de un UserLogProvider");
  }

  return context;
};
