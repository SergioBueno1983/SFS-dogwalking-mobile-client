import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import globalConstants from "../../const/globalConstants";
import { getToken } from "../../utils/authStorage";
import { Ionicons } from "@expo/vector-icons";
import { useTurns } from "../../contexts/TurnsContext";
import { useServices } from "../../contexts/ServicesContext";

export default function TurnServices({ turnId }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setTurns, fetchTurns } = useTurns();
  const { startService, finishService } = useServices();




  useEffect(() => {
    const today = new Date();
    today.setHours(today.getHours() - 3);
    const fecha = today.toISOString().split("T")[0];

    const fetchTurnServices = async () => {
      try {
        const token = await getToken();
        const response = await fetch(
          `${globalConstants.URL_BASE}/services/turn/today/${turnId}/${fecha}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const data = await response.json();
        if (!data.ok) {
          throw new Error("No se pudo obtener los servicios");
        }

        const services = data.body;

        setServices(services);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los servicios:", error);
      }
    };

    fetchTurnServices();
  }, [turnId]);

  const toggleServiceStatus = async (id, comenzado) => {
    try {
      if (!comenzado) {
        // Cambiar el estado a comenzado
        await startService(id);

        setServices((prevServices) =>
          prevServices.map((service) =>
            service.id === id ? { ...service, comenzado: true } : service,
          ),
        );

        // Actualiza el contexto de turnos
        fetchTurns();
      } else {
        await finishService(id);

        // Actualiza el estado localmente
        setServices((prevServices) =>
          prevServices.map((service) =>
            service.id === id ? { ...service, finalizado: true } : service,
          ),
        );

        // Actualiza el contexto de turnos
        fetchTurns();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        Servicios de hoy (
        {new Date().toLocaleDateString("es-ES", { weekday: "long" })})
      </Text>
      {services.length === 0 ? (
        <Text style={styles.noServicesMessage}>
          No hay servicios programados para hoy.
        </Text>
      ) : (
        services.map((service) => (
          <View
            style={[
              styles.card,
              service.finalizado
                ? styles.cardFinalized
                : service.comenzado
                  ? styles.cardStarted
                  : styles.cardNotStarted,
            ]}
            key={service.id}
          >
            <View style={styles.cardHeader}>
              <Ionicons
                name={
                  service.finalizado
                    ? "close-circle"
                    : service.comenzado
                      ? "checkmark-circle"
                      : "time"
                }
                size={24}
                color={
                  service.finalizado
                    ? "red"
                    : service.comenzado
                      ? "green"
                      : "gray"
                }
              />
              <Text style={styles.cardStatus}>
                {service.finalizado
                  ? "Finalizado"
                  : service.comenzado
                    ? "Iniciado"
                    : "No iniciado"}
              </Text>
            </View>
            <Text style={styles.cardText}>
              <Text style={styles.cardLabel}>Dirección: </Text>
              {service.direccionPickUp}
            </Text>
            <Text style={styles.cardText}>
              <Text style={styles.cardLabel}>Mascotas: </Text>
              {service.cantidad_mascotas}
            </Text>
            <Text style={styles.cardText}>
              <Text style={styles.cardLabel}>Nota: </Text>
              {service.nota || "Sin nota"}
            </Text>
            {!service.finalizado && (
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[
                    styles.button,
                    service.comenzado
                      ? styles.buttonFinish
                      : styles.buttonStart,
                  ]}
                  onPress={() =>
                    toggleServiceStatus(service.id, service.comenzado)
                  }
                >
                  <Text style={styles.buttonText}>
                    {service.comenzado ? "Finalizar" : "Iniciar"}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    width: "100%",
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  noServicesMessage: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#888",
    textAlign: "center",
    marginTop: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardStarted: {
    borderColor: "green",
    borderWidth: 2,
  },
  cardNotStarted: {
    borderColor: "gray",
    borderWidth: 2,
  },
  cardFinalized: {
    borderColor: "red",
    borderWidth: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  cardStatus: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "bold",
  },
  cardText: {
    fontSize: 16,
    marginBottom: 8,
  },
  cardLabel: {
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 16,
  },
  button: {
    padding: 10,
    borderRadius: 8,
  },
  buttonStart: {
    backgroundColor: "#007BFF",
  },
  buttonFinish: {
    backgroundColor: "#6c757d",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
});
