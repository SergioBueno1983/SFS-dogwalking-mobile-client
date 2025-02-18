import { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import globalConstants from "../../const/globalConstants";
import { Paragraph, Title } from "react-native-paper";
import StarRating from "../client/StarRating";
import { useRouter } from "expo-router";

export function WalkerCard({ walker }) {

    const [imageUrl, setImageUrl] = useState(null);
    const router = useRouter();

    
    useEffect(() => {
        if (walker?.User?.foto) {
          const apiUrl = `${globalConstants.URL_BASE_IMAGES}${walker.User.foto}`;
          setImageUrl(apiUrl);
        }
      }, [walker]); // Se ejecuta solo cuando `walker` cambia

  return (
    <View style={styles.card}>
      <Image 
        source={imageUrl ? { uri: imageUrl } : require("../../assets/no_image.png")} 
        style={styles.image} 
      />
      <View style={styles.content}>
        <Title>{walker.User.nombre_usuario}</Title>
        <StarRating rating={walker?.User.calificacion} />
        <Paragraph>Zona: {walker.Turns.map(turn => turn.zona).join(' | ')}</Paragraph>
        <TouchableOpacity style={styles.button} onPress={() => router.push(`/walker-profile/${walker.id}`)}>
          <Text style={styles.buttonText}>Ver Perfil</Text>
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
  image: {
    width: 80, // Reducir el tamaño de la imagen
    height: 80, // Reducir el tamaño de la imagen
    borderRadius: 40, // Hacer la imagen redonda
    marginRight: 16, // Margen a la derecha de la imagen
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

export default WalkerCard;