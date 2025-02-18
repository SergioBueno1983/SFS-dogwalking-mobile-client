/* eslint-disable prettier/prettier */
import { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import globalConstants from "../../const/globalConstants";
import { getToken, removeToken } from "../../utils/authStorage";
import StarRating from "../client/StarRating";
import Efectivo from "../../assets/efectivo.png";
import MercadoPago from "../../assets/mercadopago.png";
import { useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { TurnCard } from "../cards/TurnCard";

export default function WalkerProfile({ walkerId }) {
  const [walker, setWalker] = useState(null);
  const [uriImage, setUriImage] = useState(null);
  const [urlPhotos, setUrlPhotos] = useState([]);
  const router = useRouter();

  // cargo el walker y su foto de perfil
  useEffect(() => {
    const fetchWalker = async () => {
      const apiUrl = `${globalConstants.URL_BASE}/walkers/${walkerId}`;
      const token = await getToken();
      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.body.User.foto) {
        const urlImage =
          `${globalConstants.URL_BASE_IMAGES}` + data.body.User.foto;
        setUriImage(urlImage);
      }
      setWalker(data.body);
    };
    if (!walker) {
      fetchWalker();
    }
  }, [walkerId]);

  //cargo las fotos del walker
  useEffect(() => {

    const cargarImagenes = async () => {
      const urlImages = walker.fotos.map((foto) => {
        return `${globalConstants.URL_BASE_IMAGES}` + foto.url;
      });
      setUrlPhotos(urlImages);
    };

    if (walker) {
      cargarImagenes();
    }
  }, [walker]);


  

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={
            uriImage
              ? { uri: uriImage }
              : require("../../assets/no_image.png")
          }
          style={styles.profilePicture}
        />
        <View style={styles.userInfo}>
          <Text style={styles.username}>{walker?.User.nombre_usuario}</Text>
          <StarRating rating={walker?.User.calificacion} />
          <TouchableOpacity onPress={() => router.push("/walker-reviews/" + walkerId)}>
            <Text style={{ fontSize: 16, textDecorationLine: "underline" }}>Ver Reseñas</Text>
          </TouchableOpacity>
        </View>
        
      </View>
      <View style={styles.userInfo}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={styles.title}>Métodos de pago</Text>
        </View>

        <View style={styles.payMethodsContainer}>
          {walker?.efectivo && <Image source={Efectivo} style={styles.icon} />}
          {walker?.mercadopago && (
            <Image source={MercadoPago} style={styles.icon} />
          )}
        </View>
      </View>
        
      {urlPhotos.length > 0 && <View style={styles.gallery}>
        <Text style={styles.title}>Fotos del Perfil</Text>
        <ScrollView horizontal>
          {urlPhotos.map((photo, index) => (
            <Image key={index} source={{ uri: photo }} style={styles.image} />
          ))}
        </ScrollView>
      </View>}
      <View style={styles.turnsContainer}>
        <Text style={styles.title}>Turnos</Text>
        {walker?.Turns.map((turn) => (
          <TurnCard key={turn.id} turn={turn} />
        ))}
      </View>
      
    
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
    width: "100%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 20,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  payMethodsContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    marginRight: 10,
  },
  gallery: {
    height: 300,
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginRight: 10,
    objectFit: "contain",
  },
  icon: {
    width: 70,
    height: 70,
    marginRight: 30,
    objectFit: "contain",
  },
  turnsContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  turn: {
    fontSize: 16,
    marginBottom: 10,
  },
});
