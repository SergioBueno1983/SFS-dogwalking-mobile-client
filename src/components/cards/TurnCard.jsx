import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useTurns } from "../../contexts/TurnsContext";
import { Alert } from "react-native";
import { useRouter } from "expo-router";

export function TurnCard({ turn }) {
  const { deleteTurn } = useTurns();
  const router = useRouter();

  const confirmDelete = () => {
    Alert.alert(
      "Confirmar eliminación", // Título
      "¿Estás seguro de que deseas eliminar este turno?", // Mensaje
      [
        {
          text: "Cancelar", // Botón para cancelar
          style: "cancel", // Estilo para Android
        },
        {
          text: "Aceptar", // Botón para confirmar
          onPress: async () => {
            const success = await deleteTurn(turn.id);

            if (success) {
              Alert.alert(
                "Turno eliminado", // Título
                `El turno con id ${turn.id} ha sido eliminado correctamente.`, // Mensaje
                [{ text: "Aceptar" }],
                { cancelable: true },
              );
            } else {
              Alert.alert(
                "Error", // Título
                "No se pudo eliminar el turno. Intenta nuevamente.", // Mensaje
                [{ text: "Aceptar" }],
                { cancelable: true },
              );
            }
          },
        },
      ],
      { cancelable: true },
    );
  };

  const handleEdit = () => {
    router.push("/edit-turn/" + turn.id);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{turn.zona}</Text>
      <Text style={styles.info}>Tarifa: ${turn.tarifa}</Text>
      <Text style={styles.info}>
        Horario: {turn.hora_inicio.split(":")[0]}:{turn.hora_inicio.split(":")[1]} - {turn.hora_fin.split(":")[0]}:{turn.hora_fin.split(":")[1]}
      </Text>
      <View style={styles.daysContainer}>
        <Text style={styles.subtitle}>Días:</Text>
        <View style={styles.daysList}>
          {turn.dias.map((day, index) => (
            <View key={index} style={styles.dayChip}>
              <Text style={styles.dayText}>{day.slice(0, 3)}</Text>
            </View>
          ))}
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={confirmDelete} style={styles.iconButton}>
          <AntDesign name="delete" size={24} color="#FF3B30" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleEdit} style={styles.iconButton}>
          <AntDesign name="edit" size={24} color="#000" />
        </TouchableOpacity>
      </View>
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
    marginBottom: 8,
    color: "#333",
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginRight: 8,
    color: "#555",
  },
  info: {
    fontSize: 18,
    marginBottom: 4,
    color: "#666",
  },
  daysContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  daysList: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayChip: {
    backgroundColor: "#E5F1FF",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 4,
    marginBottom: 4,
  },
  dayText: {
    fontSize: 14,
    color: "#007AFF",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "50%",
    marginTop: 16,
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#F2F2F7",
  },
});
