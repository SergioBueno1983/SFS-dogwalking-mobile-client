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
import { AntDesign } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";

export default function ServiceList() {
  const { confirmedServices, fetchNextServices } = useServices();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchServices = async () => {
      await fetchNextServices();
    };

    if (confirmedServices === null) {
      fetchServices();
    }
    setLoading(false);
  }, [fetchNextServices, confirmedServices]);

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
                router.push("/service-history");
              }}
              style={styles.button}
            >
              <>
                <MaterialCommunityIcons
                  name="history"
                  size={24}
                  color="black"
                />
                <Text>Historial</Text>
              </>
            </TouchableOpacity>
          </View>
          {confirmedServices && confirmedServices.length > 0 ? (
            <ServiceListComponent services={confirmedServices} />
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
