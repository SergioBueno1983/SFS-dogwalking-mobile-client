import { StyleSheet, Text, View } from "react-native";
import globalConstants from "../../const/globalConstants";
import { getToken } from "../../utils/authStorage";
import { useUserLog } from "../../contexts/UserLogContext";
import { useEffect, useState } from "react";
import ReviewCard from "../cards/ReviewCard";

export default function ShowWalkerReviews() {
  const { userLog } = useUserLog();
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    //cargar las reviews desde la api
    const fetchReviews = async () => {
      try {
        const apiUrl = `${globalConstants.URL_BASE}/review/receiver/${userLog.id}`;
        const token = await getToken();
        const response = await fetch(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (!data.ok) {
          throw new Error("No se pudo obtener las reseñas");
        }
        setReviews(data.body);
      } catch (error) {
        console.error("Error al cargar las reseñas:", error);
      }
    };

    fetchReviews();
  }, [userLog.id]);

  return (
    <View style={{ flex: 1, paddingHorizontal: 10, paddingBottom: 10, width: "100%" }}>
      <Text style={styles.title}>Tus Reseñas</Text>

      {reviews.length > 0 ? reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      )): <Text style={styles.text}>No tienes reseñas por el momento.</Text>}
    </View>
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
