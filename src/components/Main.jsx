import { View, StyleSheet, Text } from "react-native";
import WalkersList from "./walkers/WalkerList";

export function Main() {
  return (
    <>
      <View style={styles.todayTurnsContainer}>
        <WalkersList />
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
