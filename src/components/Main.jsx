import { View, StyleSheet, Text } from "react-native";

export function Main() {
  return (
    <>
      <View style={styles.todayTurnsContainer}>
        <Text>Today turns</Text>
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
