import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import { router } from "expo-router";
import { useServices } from "../../contexts/ServicesContext";

export function ServiceCard({ service }) {
  const { cancelService } = useServices();

  const handleCancel = () => {
    Alert.alert(
      "Cancelar Servicio", // Título
      "¿Estás seguro de que deseas cancelar el servicio?", // Mensaje
      [
        {
          text: "Si",
          onPress: () =>
            cancelService(service.id, service.fecha, service.Turn.WalkerId),
        },
        { text: "No" },
      ],
      { cancelable: false },
    );
  };

  const handleReview = () => {
    router.push("/add-review/" + service.id);
  };

  const handleMap = () => {
    router.push("/service-map/" + service.id);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>
        {service.fecha.split("-").reverse().join("-")}
      </Text>
      <Text style={styles.subtitle}>{service.direccionPickUp}</Text>
      <Text style={styles.info}>
        {service.Turn.hora_inicio.slice(0, 5)} -{" "}
        {service.Turn.hora_fin.slice(0, 5)}
      </Text>
      <Text style={styles.info}>{service.nota}</Text>
      {!service.calificado_x_cliente && (
        <View style={styles.buttonContainer}>
          {!service.comenzado && (
            <>
              <TouchableOpacity
                onPress={handleCancel}
                style={styles.iconButton}
              >
                <AntDesign name="delete" size={24} color="#FF3B30" />
              </TouchableOpacity>
            </>
          )}
          {service.finalizado && !service.calificado_x_cliente && (
            <>
              <TouchableOpacity
                onPress={handleReview}
                style={styles.iconButton}
              >
                <AntDesign name="form" size={24} color="#000" />
              </TouchableOpacity>
            </>
          )}
          {service.comenzado && !service.finalizado && (
            <>
              <TouchableOpacity onPress={handleMap} style={styles.iconButton}>
                <FontAwesome5 name="map-marked-alt" size={24} color="#000" />
              </TouchableOpacity>
            </>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 16,
    margin: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    maxWidth: 300,
    alignItems: "center",
    width: "100%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#555",
  },
  info: {
    fontSize: 18,
    marginBottom: 2,
    color: "#666",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "100%",
    marginTop: 16,
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#F2F2F7",
  },
});
