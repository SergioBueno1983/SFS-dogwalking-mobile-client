import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Screen } from "../../src/components/Screen";
import { useBillsContext } from "../../src/contexts/BillsContext";
import { useEffect, useState } from "react";
import BillList from "../../src/components/bills/BillList";

export default function BillHistory() {
  const { paidBills } = useBillsContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (paidBills !== null) {
      setLoading(false);
    }
  }, [paidBills]);

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
        {paidBills && paidBills.length > 0 ? (
          <View>
            <Text style={styles.title}>Facturas pagadas</Text>
            <BillList bills={paidBills} />
          </View>
        ) : (
          <Text style={styles.text}>No hay facturas pagadas.</Text>
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
