import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useServices } from "../../src/contexts/ServicesContext";
import ServiceListComponent from "../../src/components/services/ServiceList";
import { Screen } from "../../src/components/Screen";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";

export default function ServiceList() {
  const { confirmedServices } = useServices();
  const [activeServices, setActiveServices] = useState([]);
  const [nextServices, setNextServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (confirmedServices !== null) {
      const activeServices = confirmedServices.filter(
        (service) => service.comenzado === true
      );
      const nextServices = confirmedServices.filter(
        (service) => service.comenzado === false
      );
      setActiveServices(activeServices);
      setNextServices(nextServices);
      setLoading(false);
    }
  }, [confirmedServices]);

  if (loading) {
    return (
      <Screen>
        <ActivityIndicator />
      </Screen>
    );
  }

  return (
    <ScrollView>
      <Screen>
        <>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => {
                router.push("/service-request");
              }}
              style={styles.button}
            >
              <>
                <MaterialCommunityIcons name="home" size={24} color="black" />
                <Text>Solicitudes Pendientes</Text>
              </>
            </TouchableOpacity>
          </View>
          {confirmedServices && confirmedServices.length > 0 ? (
            <>
              {activeServices.length > 0 && (
                <View>
                  <Text style={styles.text}>Servicios Activos</Text>
                  <ServiceListComponent services={activeServices} />
                </View>
              )}
              {nextServices.length > 0 && (
                <View>
                  <Text style={styles.text}>Proximos Servicios</Text>
                  <ServiceListComponent services={nextServices} />
                </View>
              )}
            </>
          ) : (
            <Text style={styles.text}>No hay servicios confirmados</Text>
          )}
        </>
      </Screen>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 100,
    alignItems: "center",
    margin: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignContent: "right",
    alignItems: "right",
    width: "100%",
  },
  text: {
    marginTop: 40,
    fontSize: 20,
    marginBottom: 20,
    textAlign: "center",
  },
});
