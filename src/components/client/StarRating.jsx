import { StyleSheet, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

export default function StarRating({ rating }) {
  return (
    <View style={styles.container}>
      {[1, 2, 3, 4, 5].map((star) => (
        <FontAwesome
          key={star}
          name={star <= rating ? "star" : "star-o"}
          size={20}
          color={star <= rating ? "#FFD700" : "#C0C0C0"}
          style={styles.star}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  star: {
    marginRight: 5,
  },
});
