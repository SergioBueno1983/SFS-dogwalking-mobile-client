// contexts/ServicesContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react";
import { useUserLog } from "./UserLogContext";
import { getToken } from "../utils/authStorage";
import globalConstants from "../const/globalConstants";

const BillsContext = createContext();

export const useBillsContext = () => useContext(BillsContext);

export const BillsProvider = ({ children }) => {
  const [unpaidBills, setUnpaidBills] = useState([]);
  const [paidBills, setPaidBills] = useState([]);
  const { userLog } = useUserLog();

  const getBills = async () => {
    try {
      const token = await getToken();
      const response = await fetch(
        `${globalConstants.URL_BASE}/bills/client/${userLog.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!response.ok) {
        throw new Error("Error al obtener las facturas");
      }
      const data = await response.json();
      const unpaidBills = data.body.filter((bill) => !bill.pagado);
      const paidBills = data.body.filter((bill) => bill.pagado);
      setUnpaidBills(unpaidBills); // Guardar las facturas impagas en el estado
      setPaidBills(paidBills); // Guardar las facturas pagadas en el estado
    } catch (error) {
      console.error("Error fetching unpaid bills:", error);
    }
  };

  useEffect(() => {
    if (userLog) {
      getBills();
    }
  }, [userLog]);

  return (
    <BillsContext.Provider
      value={{
        unpaidBills,
        paidBills,
        getBills,
      }}
    >
      {children}
    </BillsContext.Provider>
  );
};
