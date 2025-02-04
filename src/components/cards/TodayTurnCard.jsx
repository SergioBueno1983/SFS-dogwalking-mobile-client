import React, { useEffect, useState } from "react";
import { Text, StyleSheet } from "react-native";
import { useServices } from "../../contexts/ServicesContext";

export default function TodayTurnCard({ item }) {
  const [servicesCount, setServicesCount] = useState(0);
  const { confirmedServices } = useServices();

  useEffect(() => {
    // obtengo la fecha actual en fomrato yyyy-MM-dd
    const formattedToday = new Date();
    // le resto 3 horas a formattedToday
    formattedToday.setHours(formattedToday.getHours() - 3);
    const finalToday = formattedToday.toISOString().split("T")[0];

    const serviciosAgendados = confirmedServices.filter((service) => service.TurnId === item.id && service.fecha === finalToday);
    setServicesCount(serviciosAgendados.length);
  }, [confirmedServices]);

  return (
    <>
      <Text style={styles.label}>
        <Text style={styles.labelTitle}>Zona:</Text> {item.zona}
      </Text>
      <Text style={styles.label}>
        <Text style={styles.labelTitle}>Hora:</Text> {item.hora_inicio.split(":")[0]}:{item.hora_inicio.split(":")[1]} - {item.hora_fin.split(":")[0]}:{item.hora_fin.split(":")[1]}
      </Text>
      <Text style={styles.label}>
        <Text style={styles.labelTitle}>Tarifa:</Text> ${item.tarifa}
      </Text>
      <Text style={styles.servicesLabel}>
        <Text style={styles.labelTitle}>Servicios agendados: </Text>
        {servicesCount}
      </Text>
    </>

  )
}

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  labelTitle: {
    fontWeight: "bold",
  },
  servicesLabel: {
    fontSize: 16,
    marginBottom: 5,
    textDecorationLine: "underline",
    fontWeight: "bold",
  },
});