import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { getToken } from "../../utils/authStorage";
import globalConstants from "../../const/globalConstants";
import { useRouter } from "expo-router";
import { useBillsContext } from "../../contexts/BillsContext";

export default function BillCard({ bill }) {
  const router = useRouter();
  const { getBills } = useBillsContext();

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
      console.log(data);
      if (!data.ok) {
        throw new Error("Network error");
      }

      await getBills();
      router.back();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.username}>{bill.fecha}</Text>
      </View>
      <Text style={styles.description}>{bill.monto}</Text>
      {bill.Service.comenzado === true ? (
        <>
          {bill.Service.Turn.Walker.efectivo &&
            bill.pagado === false &&
            bill.pendiente === false && (
              <TouchableOpacity onPress={onCashPayment}>
                <Text>Pagar con Efectivo</Text>
              </TouchableOpacity>
            )}
          {bill.Service.Turn.Walker.mercadopago &&
            bill.pagado === false &&
            bill.pendiente === false && (
              <TouchableOpacity>
                <Text>Pagar con MercadoPago</Text>
              </TouchableOpacity>
            )}
          {bill.pendiente === true && (
            <Text>Esta factura está pendiente de pago</Text>
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
  username: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
});
