import React, { useEffect, useState, useCallback } from "react";
import { useTurns } from "../../contexts/TurnsContext";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  Vibration,
} from "react-native";
import { router } from "expo-router";
import { useServices } from "../../contexts/ServicesContext";
import TodayTurnCard from "../cards/TodayTurnCard";

export default function TodayTurns() {
  const { turns } = useTurns();
  const [todayTurns, setTodayTurns] = useState([]);
  const { confirmedServices } = useServices();
  const [dayName, setDayName] = useState("");

  useEffect(() => {
    if (!turns) {
      return;
    }
    const days = [
      "domingo",
      "lunes",
      "martes",
      "miercoles",
      "jueves",
      "viernes",
      "sabado",
    ];
    const today = new Date();
    today.setHours(today.getHours() - 3);

    const todayDay = today.getDay();

    const todayName = days[todayDay];
    setDayName(todayName);

    const filteredTurns = turns.filter((turn) => turn.dias.includes(todayName));

    filteredTurns.sort((a, b) => {
      const timeA = new Date(`1970-01-01T${a.hora_inicio}Z`);
      const timeB = new Date(`1970-01-01T${b.hora_inicio}Z`);
      return timeA - timeB;
    });

    const formattedToday = new Date();
    formattedToday.setHours(formattedToday.getHours() - 3);
    const finalToday = formattedToday.toISOString().split("T")[0];

    const turnsWithAcceptedServices = filteredTurns.map((turn) => ({
      ...turn,
      Services: turn.Services.filter(
        (service) => service.aceptado && service.fecha.includes(finalToday),
      ),
      shakeAnimation: new Animated.Value(0), // Add individual animation value for each turn
    }));

    setTodayTurns(turnsWithAcceptedServices);
  }, [turns]);

  useEffect(() => {}, [confirmedServices]);

  const shakeItem = (item) => {
    Animated.sequence([
      Animated.timing(item.shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(item.shakeAnimation, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(item.shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(item.shakeAnimation, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePress = (item) => {
    const formattedToday = new Date();
    formattedToday.setHours(formattedToday.getHours() - 3);
    const finalToday = formattedToday.toISOString().split("T")[0];

    const serviciosAgendados = confirmedServices.filter(
      (service) => service.TurnId === item.id && service.fecha === finalToday,
    );
    if (serviciosAgendados.length > 0) {
      router.push(`/current-turn-services/${item.id}`);
    } else {
      vibration();
      shakeItem(item);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handlePress(item)}>
      <Animated.View
        style={[
          styles.turnItem,
          {
            transform: [{ translateX: item.shakeAnimation }],
          },
        ]}
      >
        <TodayTurnCard item={item} />
      </Animated.View>
    </TouchableOpacity>
  );

  const vibration = useCallback(() => {
    Vibration.vibrate(400);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Turnos de hoy ({dayName})</Text>
      {todayTurns.length === 0 ? (
        <Text style={styles.noTurnsMessage}>
          No hay turnos programados para hoy.
        </Text>
      ) : (
        <View style={styles.turnListContainer}>
          <FlatList
            data={todayTurns}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    width: "100%",
    alignItems: "center",
  },
  turnListContainer: {
    width: "100%",
    overflow: "scroll",
    alignContent: "center",
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  turnItem: {
    backgroundColor: "#ffffff",
    alignItems: "center",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  noTurnsMessage: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#888",
    marginTop: 20,
  },
});
