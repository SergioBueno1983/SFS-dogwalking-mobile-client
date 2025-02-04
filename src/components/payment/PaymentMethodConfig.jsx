import React, { use, useState } from "react";
import {
  Text,
  View,
  Switch,
  TouchableOpacity,
  StyleSheet,
  Button,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useUserLog } from "../../contexts/UserLogContext";
import globalConstants from "../../const/globalConstants";
import { openBrowserAsync } from "expo-web-browser";
import { getToken } from "../../utils/authStorage";
import { useRouter } from "expo-router";

export default function PaymentMethodConfig() {
  const { userLog, setUserLog } = useUserLog();
  const [isCashEnabled, setIsCashEnabled] = useState(userLog.efectivo);
  const [isMercadoPagoEnabled, setIsMercadoPagoEnabled] = useState(
    userLog.mercadopago,
  );
  const [message, setMessage] = useState("");
  const router = useRouter();

  const toggleCash = () => setIsCashEnabled((prevState) => !prevState);
  const toggleMercadoPago = () =>
    setIsMercadoPagoEnabled((prevState) => !prevState);

  const handleNavigate = () => {
    openBrowserAsync(
      `https://auth.mercadopago.com.uy/authorization?client_id=${globalConstants.MP_APP_ID}&response_type=code&platform_id=mp&state=${userLog.nombre_usuario}&redirect_uri=${globalConstants.MP_SUCCESS_URL}`,
    );
  };

  const handleSubmit = async () => {
    try {
      if (!isMercadoPagoEnabled && !isCashEnabled) {
        setMessage("Debes habilitar al menos un método de pago");
        return;
      }
      const token = await getToken();
      const response = await fetch(`${globalConstants.URL_BASE}/payments/manage/${userLog.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          mercadopago: isMercadoPagoEnabled,
          efectivo: isCashEnabled,
        }),
      });
      
      //modifico el userLog local
      setUserLog((prevUserLog) => ({
        ...prevUserLog,
        mercadopago: isMercadoPagoEnabled,
        efectivo: isCashEnabled,
      }));
      
  
      if (!response.ok) {
        throw new Error(`Error al actualizar el pago: ${response.status}`);
      }

      router.push(-1);
    } catch (error) {
      console.error("Error al actualizar el pago:", error);
      setMessage("Error al actualizar el pago");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.switchContainer}>
        <Text style={styles.label}>Efectivo</Text>
        <Switch value={isCashEnabled} onValueChange={toggleCash} />
      </View>
      <View style={styles.switchContainer}>
        <Text style={styles.label}>Mercado Pago</Text>
        <Switch
          value={isMercadoPagoEnabled}
          onValueChange={toggleMercadoPago}
          disabled={!userLog.refresh_token}
        />
      </View>
      {!userLog.refresh_token && (
        <View style={styles.container}>
          <Button
            title="Asociar MercadoPago"
            onPress={() => handleNavigate()}
          />
        </View>
      )}
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleSubmit()}
      >
        <Text style={styles.buttonText}>Guardar</Text>
      </TouchableOpacity>
      {message && <Text style={{ color: "red" }}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "flex-start",
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: "#333",
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
