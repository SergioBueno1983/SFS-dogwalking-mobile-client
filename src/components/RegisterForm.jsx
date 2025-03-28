import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import GlobalConstants from "../const/globalConstants";
import { useRouter } from "expo-router";
import { Screen } from "./Screen";
import Ionicons from "@expo/vector-icons/Ionicons";

export function RegisterForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const router = useRouter();
  const [hideNewPassword, setHideNewPassword] = useState(true);

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false); // Cierra el DatePicker al seleccionar una fecha
    if (selectedDate) {
      setDateOfBirth(selectedDate); // Actualiza la fecha seleccionada
    }
  };

  const handleSubmit = async () => {
    // paso dateOfBirth a formato "yyyy-mm-dd"
    const dateOfBirthFormatted = dateOfBirth.toISOString().split("T")[0];
    try {
      const apiUrl = `${GlobalConstants.URL_BASE}/clients`;

      // hago el fetch a la api
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre_usuario: username,
          contraseña: password,
          direccion: address,
          email: email,
          telefono: phone,
          fecha_nacimiento: dateOfBirthFormatted,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error en el registro: ${response.status}`);
      }
      Alert.alert(
        "Usuario registrado", // Título
        "¡Su usuario ha sido registrado con éxito!", // Mensaje
        [
          {
            text: "Ok",
            onPress: () =>
              router.back(),
          },
        ],
        { cancelable: false },
      );
    } catch (error) {
      console.error("Error al registrar el usuario:", error);
    }
  };

  return (
      <View style={styles.container}>
        <Text style={styles.title}>Registro de Usuario</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nombre de usuario</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            placeholder="Ingrese su nombre de usuario"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Contraseña</Text>
          <View style={styles.inputWithIcon}>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Ingrese su contraseña"
              secureTextEntry={hideNewPassword}
            />
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => setHideNewPassword(!hideNewPassword)}
            >
              <Ionicons
                name={hideNewPassword ? "eye" : "eye-off"}
                size={24}
                color="gray"
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Dirección</Text>
          <TextInput
            style={styles.input}
            value={address}
            onChangeText={setAddress}
            placeholder="Ingrese su dirección"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>E-Mail</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Ingrese su correo electrónico"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Teléfono</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="Ingrese su número de teléfono"
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Fecha de Nacimiento</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text>{dateOfBirth.toLocaleDateString()}</Text>
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
            mode="date"
            display="default"
            value={dateOfBirth}
            onChange={onDateChange}
          />
        )}

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Registrarse</Text>
        </TouchableOpacity>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 15,
    width: "95%",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#333",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  dateButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
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
  iconButton: {
    padding: 10, // Espaciado interno para que el ícono tenga buen tamaño
    justifyContent: "center",
    alignItems: "center",
  },
  inputWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    width: "100%",
  },
});
