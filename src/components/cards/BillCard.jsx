import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { getToken } from "../../utils/authStorage";
import globalConstants from "../../const/globalConstants";
import { useRouter } from "expo-router";
import { useBillsContext } from "../../contexts/BillsContext";
import { useEffect, useState } from "react";
import { openBrowserAsync} from "expo-web-browser";


export default function BillCard({ bill }) {
  const router = useRouter();
  const { getBills } = useBillsContext();
  const [efectivoDisponible, setEfectivoDisponible] = useState(null);
  const [mercadopagoDisponible, setMercadopagoDisponible] = useState(null);
  const [url, setUrl] = useState(null);

  const onCashPayment = async () => {
    try {
      const token = await getToken();

      // hago un fetch
      const response = await fetch(
        `${globalConstants.URL_BASE}/bills/${bill.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            pagado: false,
            pendiente: true,
          }),
        },
      );
      const data = await response.json();
      if (!data.ok) {
        throw new Error("Network error");
      }

      await getBills();
      router.back();
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPaymentData = async () => {
    try {
      const token = await getToken();
      const response = await fetch(`${globalConstants.URL_BASE}/bills/pay` , {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
          
        },
        body: JSON.stringify({
          billId: bill.id // Pasar el ID de la factura al backend
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setPreferenceId(data.id);
      setUrl(data.url);

    } catch (error) {
      console.error('Failed to fetch payment data:', error);
    }
  };

  const verificarMercadoPago = async () => {
    try {
      const token = await getToken();
      const response = await fetch(`${globalConstants.URL_BASE}/walkers/byBill/${bill.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      return data.body;
    } catch (error) {
      console.error('Failed to fetch walker data:', error);
    }
  };

  useEffect(() => {
    async function fetchData() {
      if (bill) {
        const walker = await verificarMercadoPago();
        setMercadopagoDisponible(walker.mercadopago); // Actualizar el estado
        setEfectivoDisponible(walker.efectivo); // Actualizar el estado

        if (walker.mercadopago) {
          fetchPaymentData();
        }
      }
    }

    fetchData();
  }, [bill]);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Factura Nº {bill.id}</Text>
      </View>
      
      <Text style={styles.subtitle}>Fecha del servicio: <Text style={{fontWeight: "bold"}}>{bill.fecha.split('-').reverse().join('-')}</Text></Text>
      <Text style={styles.description}>
        <Text style={styles.bold}>Paseador:</Text> {bill.Service.Turn.Walker.User.nombre_usuario}
      </Text>
      <Text style={styles.description}>
        <Text style={styles.bold}>Cantidad de mascotas:</Text> {bill.Service.cantidad_mascotas}
      </Text>
      <Text style={styles.description}>
        <Text style={styles.bold}>Direccion:</Text> {bill.Service.direccionPickUp}
      </Text>
      <Text style={styles.description}>
        <Text style={styles.bold}>Total: </Text> ${bill.monto}
      </Text>
      {bill.Service.comenzado === true ? (
        <>
          {efectivoDisponible &&
            bill.pagado === false &&
            bill.pendiente === false && (
              <TouchableOpacity style={styles.button} onPress={onCashPayment}>
                <Text style={styles.buttonText}>Pagar con Efectivo</Text>
              </TouchableOpacity>
            )}
          {mercadopagoDisponible &&
            bill.pagado === false &&
            bill.pendiente === false && (
              <TouchableOpacity style={styles.button} onPress={() => openBrowserAsync(url)}>
                <Text style={styles.buttonText}>Pagar con MercadoPago</Text>
              </TouchableOpacity>
            )}
          {bill.pendiente === true && (
            <View style={styles.infoContainer}>
              <Text style={styles.infoText}>Esta factura está pendiente de pago</Text>
            </View>
            
          )}
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  header: {
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 8,
    color: "#555",
  },
  description: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  bold: {
    fontWeight: "bold",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#007AFF",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    height: 40,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  infoContainer: {
    height: 30,
    marginTop: 10,
    backgroundColor: "#f5f5f5",
    borderColor: "#ddd",
    shadowRadius: 5,
    borderRadius: 5,
    borderWidth: 1,
    alignContent: "center",
    justifyContent: "center",
  },
  infoText: {
    fontSize: 16,
    color: "rgba(0, 0, 0, 0.6)",
    textAlign: "center",
  },
});
