import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { Screen } from "./Screen";
import { removeToken } from "../utils/authStorage";
import { TurnCard } from "./cards/TurnCard";
import { ServiceCard } from "./cards/ServiceCard";
import { Link } from "expo-router";
import { useServices } from "../contexts/ServicesContext";
import { useTurns } from "../contexts/TurnsContext";
import TodayTurns from "./turns/TodayTurns";

export function Main() {
  const { fetchNextServices, fetchFinishedServices } = useServices();
  const { fetchTurns } = useTurns();

  const handleLogout = async () => {
    await removeToken();
  };

  //ejecutar contexto de servicios
  const handleEject = async () => {
    fetchNextServices();
    fetchFinishedServices();
  };

  return (
    <>
      <View style={styles.todayTurnsContainer}>
        <TodayTurns />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  todayTurnsContainer: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});
