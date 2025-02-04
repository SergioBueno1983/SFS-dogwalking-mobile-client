import { Text, View, StyleSheet } from "react-native";
import StarRating from "../walker/StarRating";

export default function ReviewCard({ review }) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.username}>{review.writer.nombre_usuario}</Text>
        <StarRating rating={review.valoracion} />
      </View>
      <Text style={styles.description}>{review.descripcion}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  header: {
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
});
