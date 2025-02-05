import React, { useState } from "react";
import {
  Text,
  TextInput,
  ScrollView,
  View,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useUserLog } from "../../contexts/UserLogContext";
import globalConstants from "../../const/globalConstants";
import { getToken } from "../../utils/authStorage";
import { useServices } from "../../contexts/ServicesContext";

export function AddReviewForm({ serviceId }) {
  const [valoracion, setValoracion] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const router = useRouter();
  const { userLog } = useUserLog();
  const [error, setError] = useState("");
  const { markAsReviewed } = useServices();

  const handleSubmit = async () => {
    try {
      //hago un fetch a la api para traer el servicio
      const apiUrl = `${globalConstants.URL_BASE}/services/${serviceId}`;
      const token = await getToken();

      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      const service = data.body;

      if (!service) {
        router.back();
        throw new Error("No se pudo obtener el servicio");
      }

      const verify = verifyReview();

      if (!verify) {
        return;
      }

      const review = {
        valoracion: valoracion,
        descripcion: descripcion,
        receiverId: service.Turn.WalkerId,
        writerId: userLog.id,
        serviceId: service.id,
      };

      const reviewResponse = await fetch(`${globalConstants.URL_BASE}/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(review),
      });

      if (reviewResponse.ok) {
        await markAsReviewed(service.id);
        Alert.alert(
          "Reseña enviada", // Título
          "La reseña ha sido enviada correctamente.", // Mensaje
          [{ text: "Aceptar", onPress: () => router.back() }],
          { cancelable: false },
        );
      }
    } catch (error) {
      setError(error.message);
      console.error("Error al crear la reseña:", error.message);
    }
  };

  const verifyReview = () => {
    let verify = true;
    setError(null);

    if (valoracion < 1 || valoracion > 5) {
      verify = false;
      setError("Valoracion debe ser un numero entre 1 y 5");
    }

    if (!valoracion || !descripcion) {
      verify = false;
      setError("Todos los campos son obligatorios");
    }

    return verify;
  };

  if (!userLog) {
    return <Text>Cargando...</Text>; // Puedes mostrar un indicador de carga mientras esperas
  }

  return (
    <View style={styles.container}> 
      <Text style={styles.title}>Agregar Reseña</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Valoracion</Text>
        <TextInput
          style={styles.input}
          value={valoracion}
          onChangeText={setValoracion}
          placeholder="Ingrese la valoracion"
          inputMode="numeric"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Descripcion</Text>
        <TextInput
          style={styles.input}
          value={descripcion}
          onChangeText={setDescripcion}
          placeholder="Ingrese una descripcion"
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Agregar</Text>
      </TouchableOpacity>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
 
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
    width: "100%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  daysContainer: {
    marginBottom: 15,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#007AFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: "#007AFF",
  },
  checkboxLabel: {
    fontSize: 16,
    color: "#333",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  error: {
    color: "red",
    fontSize: 16,
    marginTop: 10,
  },
});
