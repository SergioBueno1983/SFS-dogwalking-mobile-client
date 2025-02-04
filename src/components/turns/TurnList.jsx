import { ScrollView, Text, ActivityIndicator, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { Screen } from "../Screen";
import { TurnCard } from "../cards/TurnCard";
import { useTurns } from "../../contexts/TurnsContext";

export default function TurnListComponent() {
  const [loading, setLoading] = useState(true);
  const { turns } = useTurns();

  useEffect(() => {
    if (turns) {
      setLoading(false);
    }
  }, [turns]);

  if (loading) {
    return (
      <Screen>
        <ActivityIndicator />
      </Screen>
    );
  }

  return (
    <>
      <Text style={styles.title}>Lista de turnos.</Text>
      {turns.length > 0 ? (
        turns.map((turn) => <TurnCard key={turn.id} turn={turn} />)
      ) : (
        <Text style={styles.text}>No hay turnos disponibles.</Text>
      )}
    </>
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
