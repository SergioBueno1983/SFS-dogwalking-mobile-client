import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useTurns } from "../../src/contexts/TurnsContext";
import ServiceListComponent from "../../src/components/services/ServiceList";
import { Screen } from "../../src/components/Screen";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import TurnListComponent from "../../src/components/turns/TurnList";

export default function TurnList() {
  const router = useRouter();
  const { turns, fetchTurns } = useTurns();

  return (
    <ScrollView>
      <Screen>
        <>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => {
                router.push("/add-turn");
              }}
              style={styles.button}
            >
              <AntDesign name="plus" size={24} color="black" />
            </TouchableOpacity>
          </View>

          <TurnListComponent />
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
});
