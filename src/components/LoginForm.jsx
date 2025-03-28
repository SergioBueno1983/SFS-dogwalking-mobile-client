import React, { useEffect, useState } from "react";
import {
  Text,
  TextInput,
  ScrollView,
  View,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
} from "react-native";
import GlobalConstants from "../const/globalConstants";
import { saveToken } from "../utils/authStorage";
import { Link, useRouter } from "expo-router";
import { getToken } from "../utils/authStorage";
import { Screen } from "./Screen";
import { useUserLog } from "../contexts/UserLogContext";
import * as SecureStore from "expo-secure-store";

export function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { login } = useUserLog();

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await getToken();
        if (token) {
          // eslint-disable-next-line no-undef
          setTimeout(() => {
            router.replace("/mainPage");
          }, 0);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Error al obtener el token:", error);
        setLoading(false);
      }
    };

    checkToken(); // Llamada a la función asíncrona
  }, [router]);

  const handleSubmit = async () => {
    const apiUrl = `${GlobalConstants.URL_BASE}/login/client`;

    try {
      // hago el fetch a la api
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error en el login: ${response.status}`);
      }

      const data = await response.json();
      if (data.token) {
        // Guarda el token usando SecureStore
        await saveToken(data.token);
        await SecureStore.setItemAsync(
          "userLog",
          JSON.stringify(data.loggedUser),
        );
        // Guardo el usuario en el contexto
        login(data.loggedUser);
        router.replace("/mainPage");
      } else {
        console.error("No se recibió un token en la respuesta.");
      }
    } catch (error) {
      console.error("Error en el proceso de login:", error.message);
    }
  };

  return (
    <>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <View style={styles.container}>
          <Text style={styles.title}>Ingrese su usuario y contraseña</Text>

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
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Ingrese su contraseña"
              secureTextEntry
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Ingresar</Text>
          </TouchableOpacity>

          <Link asChild href="/register">
            <Pressable style={styles.button}>
              <Text style={styles.buttonText}>Registrarse</Text>
            </Pressable>
          </Link>
        </View>
      )}
    </>
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
});
