import React, { createContext, useContext, useEffect, useState } from "react";
import globalConstants from "../const/globalConstants";
import { useUserLog } from "./UserLogContext";
import { getToken } from "../utils/authStorage";

// Crear el contexto
const ShowHeaderToolsContext = createContext();

// Proveedor del contexto
export const ShowHeadreToolsProvider = ({ children }) => {
  const [showChats, setShowChats] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);



  return (
    <ShowHeaderToolsContext.Provider
      value={{
        showChats,
        setShowChats,
        showNotifications,
        setShowNotifications,
      }}
    >
      {children}
    </ShowHeaderToolsContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useShowHeaderTools = () => {
  const context = useContext(ShowHeaderToolsContext);

  if (!context) {
    throw new Error("useShowHeaderTools debe usarse dentro de un ShowHeaderToolsProvider");
  }

  return context;
};
