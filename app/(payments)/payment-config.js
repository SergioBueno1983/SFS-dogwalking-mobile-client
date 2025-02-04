import { View, Text, StyleSheet } from "react-native";
import PaymentMethodConfig from "../../src/components/payment/PaymentMethodConfig";

export default function PaymentConfig() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configuración de pago</Text>
      <PaymentMethodConfig />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
    width: "100%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
});
