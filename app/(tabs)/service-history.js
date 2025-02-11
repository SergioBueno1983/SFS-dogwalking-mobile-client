import React, { useEffect, useState } from "react";
import { Text, ActivityIndicator, ScrollView, StyleSheet } from "react-native";
import { useServices } from "../../src/contexts/ServicesContext";
import ServiceListComponent from "../../src/components/services/ServiceList";
import { Screen } from "../../src/components/Screen";

export default function ServiceHistory() {
  const { servicesHistory } = useServices();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (servicesHistory !== null) {
      setLoading(false);
    }
  }, [servicesHistory]);

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
        {servicesHistory && servicesHistory.length > 0 ? (
          <ServiceListComponent services={servicesHistory} />
        ) : (
          <Text style={styles.text}>No hay servicios en el historial.</Text>
        )}
      </Screen>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  text: {
    marginTop: 40,
    fontSize: 20,
    marginBottom: 20,
    textAlign: "center",
  },
});
