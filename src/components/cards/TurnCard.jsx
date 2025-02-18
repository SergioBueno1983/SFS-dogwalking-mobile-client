import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Paragraph, Title } from "react-native-paper";
import { useRouter } from "expo-router";

export function TurnCard({ turn }) {
    const router = useRouter();
    const horaInicio = turn.hora_inicio.split(":")[0] + ":" + turn.hora_inicio.split(":")[1];
    const horaFin = turn.hora_fin.split(":")[0] + ":" + turn.hora_fin.split(":")[1];

  return (
    <View style={styles.card}>
      <View style={styles.content}>
        <Title>{turn.zona}</Title>
        <Paragraph>{horaInicio}hs. - {horaFin}hs.</Paragraph>
        <Paragraph>$ {turn.tarifa}</Paragraph>
        <TouchableOpacity style={styles.button} onPress={() => router.push(`/add-service/${turn.id}`)}>
          <Text style={styles.buttonText}>Solicitar Servicio</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 16,
    margin: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: "row", // Coloca la imagen y el contenido en una fila
    alignItems: "center", // Alinea los elementos verticalmente al centro
  },
  content: {
    flex: 1, // El contenido ocupa el espacio restante
  },
  button: {
    marginTop: 10,
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default TurnCard;