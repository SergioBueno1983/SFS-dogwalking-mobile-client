import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, ScrollView, StyleSheet } from "react-native";
import { useServices } from "../../src/contexts/ServicesContext";
import ServiceListComponent from "../../src/components/services/ServiceList";
import { Screen } from "../../src/components/Screen";

export default function ServiceRequests() {
  const { servicesHistory, fetchFinishedServices } = useServices();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      await fetchFinishedServices();
    };

    if (servicesHistory === null) {
      fetchServices();
    }
    setLoading(false);
  }, [servicesHistory, fetchFinishedServices]);

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

        {servicesHistory && servicesHistory.length > 0 ? (
          <ServiceListComponent services={servicesHistory} />
        ) : (
          <Text style={styles.text}>No hay servicios en el historial</Text>
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
