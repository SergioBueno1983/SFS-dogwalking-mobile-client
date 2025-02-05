import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, ScrollView, StyleSheet } from "react-native";
import { useServices } from "../../src/contexts/ServicesContext";
import ServiceListComponent from "../../src/components/services/ServiceList";
import { Screen } from "../../src/components/Screen";

export default function ServiceRequests() {
  const { servicesRequest } = useServices();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (servicesRequest !== null) {
      setLoading(false);
    }
  }, [servicesRequest]);

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
      <Text style={styles.title}>Servicios realizados</Text>

        {servicesRequest && servicesRequest.length > 0 ? (
          <ServiceListComponent services={servicesRequest} />
        ) : (
          <Text style={styles.text}>No hay solicitudes de servicio pendientes.</Text>
        )}
      </Screen>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  text: {
    marginTop: 40,
    fontSize: 20,
    marginBottom: 20,
    textAlign: "center",
  },
});
