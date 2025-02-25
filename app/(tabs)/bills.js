import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useBillsContext } from "../../src/contexts/BillsContext";
import { Screen } from "../../src/components/Screen";
import BillList from "../../src/components/bills/BillList";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";

export default function Bills() {
  const { unpaidBills } = useBillsContext();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (unpaidBills !== null) {
      setLoading(false);
    }
  }, [unpaidBills]);

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
        <View style={styles.container}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => {
                router.push("/bills-history");
              }}
              style={styles.button}
            >
              <>
                <MaterialCommunityIcons
                  name="history"
                  size={24}
                  color="black"
                />
                <Text>Historial de facturas</Text>
              </>
            </TouchableOpacity>
          </View>
          {unpaidBills && unpaidBills.length > 0 ? (
            <BillList bills={unpaidBills} />
          ) : (
            <Text style={styles.text}>No hay facturas pendientes.</Text>
          )}
        </View>
      </Screen>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
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
