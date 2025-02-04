/* eslint-disable prettier/prettier */
import { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  Modal,
  TouchableOpacity,
} from "react-native";
import globalConstants from "../../const/globalConstants";
import { getToken, removeToken } from "../../utils/authStorage";
import StarRating from "./StarRating";
import Efectivo from "../../assets/efectivo.png";
import MercadoPago from "../../assets/mercadopago.png";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { useUserLog } from "../../contexts/UserLogContext";

export default function WalkerProfile() {
  const [walker, setWalker] = useState(null);
  const [uriImage, setUriImage] = useState(null);
  const [urlPhotos, setUrlPhotos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false); // Controla el modal
  const [selectedPhoto, setSelectedPhoto] = useState(null); // Guarda la foto seleccionada para eliminar
  const [deleteModalVisible, setDeleteModalVisible] = useState(false); // Modal para confirmar la eliminación de la foto
  const router = useRouter();
  const { userLog, setUserLog, logout } = useUserLog();

  // cargo el walker y su foto de perfil
  useEffect(() => {
    if (!userLog || !userLog.id) {
      return <Text>No hay usuario autenticado</Text>;
    }
    const fetchWalker = async () => {
      const apiUrl = `${globalConstants.URL_BASE}/walkers/${userLog.id}`;
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
  }, [walker, userLog.id]);

  //cargo las fotos del walker
  useEffect(() => {
    if (!userLog || !userLog.id) {
      return <Text>No hay usuario autenticado</Text>;
    }
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

  useEffect(() => {
  }, [urlPhotos]);

  useEffect(() => {
    if (walker) {
      //actualizo la propiedad fotos del walker
      setWalker({ ...walker, fotos: userLog.fotos });
    }
  }, [userLog.fotos]);

  const handleSelectPhoto = async () => {
    if (!userLog || !userLog.id) {
      return <Text>No hay usuario autenticado</Text>;
    }
    // Paso 1: Solicitar permisos
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      alert("Se necesita permiso para acceder a las fotos.");
      return;
    }

    // Paso 2: Abrir la galería
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true, // Permitir recortar la imagen
      quality: 1,
    });

    if (!result.canceled) {
      const localUri = result.assets[0].uri;

      // Paso 3: Crear FormData y subir la foto
      const formData = new FormData();
      formData.append("imagenPerfil", {
        uri: localUri,
        name: "profile.jpg", // Nombre del archivo
        type: "image/jpeg", // Tipo MIME
      });

      try {
        const token = await getToken();
        const username = walker?.User.nombre_usuario;

        const response = await fetch(
          `${globalConstants.URL_BASE}/image/single/${username}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`, // Si tu API requiere autenticación
            },
            body: formData,
          },
        );

        const data = await response.json();
        if (data.ok) {
          setModalVisible(false); // Cerramos el modal
          alert("Imagen de perfil actualizada exitosamente");
          setUriImage(localUri); // Actualiza la imagen de perfil localmente
        } else {
          alert("Error al actualizar la imagen: " + data.message);
        }
      } catch (error) {
        console.error("Error al subir la imagen:", error);
        alert("Error al subir la imagen. Por favor, inténtalo de nuevo.");
      }
    }
  };

  const handleLongPress = (photo) => {
    const photoName = photo.split("/").pop(); // Obtiene el nombre de la foto de la URL
    setSelectedPhoto(photoName); // Guarda la foto seleccionada
    setDeleteModalVisible(true); // Muestra el cuadro de opciones
  };

  const handleDeletePhoto = async () => {
    if (!userLog || !userLog.id) {
      return <Text>No hay usuario autenticado</Text>;
    }
    // Lógica para eliminar la foto
    try {
      const token = await getToken();
      const response = await fetch(
        `${globalConstants.URL_BASE}/image/${userLog.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ imageUrl: selectedPhoto }),
        },
      );

      const data = await response.json();
      if (data.ok) {
        setDeleteModalVisible(false); // Cierra el modal de confirmación
        const urlSelectedPhoto =
          globalConstants.URL_BASE_IMAGES + selectedPhoto;
        setUrlPhotos(urlPhotos.filter((photo) => photo !== urlSelectedPhoto)); // Elimina la foto de la lista
        //elimino la foto de userlog.fotos
        setUserLog((prevUserLog) => ({
          ...prevUserLog,
          fotos: prevUserLog.fotos.filter((foto) => foto.url !== selectedPhoto),
        }));
        alert("Foto eliminada exitosamente.");
      } else {
        alert("Error al eliminar la foto.");
      }
    } catch (error) {
      console.error("Error al eliminar la foto:", error);
      alert("Error al eliminar la foto. Inténtalo nuevamente.");
    }
  };

  const handleLogOut = async () => {
    await removeToken();
    await logout();
    router.replace("/");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => setModalVisible(true)}>
          <Image
            source={
              uriImage
                ? { uri: uriImage }
                : require("../../assets/no_image.png")
            }
            style={styles.profilePicture}
          />
        </Pressable>
        <View style={styles.userInfo}>
          <Text style={styles.username}>{walker?.User.nombre_usuario}</Text>
          <StarRating rating={walker?.User.calificacion} />
          <TouchableOpacity onPress={() => router.push("/walker-reviews")}>
            <Text style={{ fontSize: 16, textDecorationLine: "underline" }}>Ver Reseñas</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={{ position: "absolute", top: 0, right: 0, padding: 10 }}
          onPress={() => router.push("/edit-walker-profile")}
        >
          <AntDesign name="form" size={28} />
        </TouchableOpacity>
      </View>
      <View style={styles.userInfo}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={styles.title}>Métodos de pago</Text>
          <TouchableOpacity onPress={() => router.push("/payment-config")}>
            <AntDesign name="edit" size={24} />
          </TouchableOpacity>
        </View>

        <View style={styles.payMethodsContainer}>
          {walker?.efectivo && <Image source={Efectivo} style={styles.icon} />}
          {walker?.mercadopago && (
            <Image source={MercadoPago} style={styles.icon} />
          )}
        </View>
      </View>
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}
      >
        <Text style={styles.title}>Fotos del Perfil</Text>
        <TouchableOpacity onPress={() => router.push("/add-walker-photo")}>
          <AntDesign name="plus" size={32} />
        </TouchableOpacity>
      </View>
      <View style={styles.gallery}>
        <ScrollView horizontal>
          {urlPhotos.map((photo, index) => (
            <Pressable key={index} onLongPress={() => handleLongPress(photo)}>
              <Image key={index} source={{ uri: photo }} style={styles.image} />
            </Pressable>
          ))}
        </ScrollView>
      </View>
      <TouchableOpacity onPress={handleLogOut}>
        <Text style={{ fontSize: 16, textDecorationLine: "underline" }}>Cerrar sesión</Text>
      </TouchableOpacity>

      {/* Modal de confirmación de eliminación */}
      <Modal
        transparent={true}
        visible={deleteModalVisible}
        animationType="fade"
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              ¿Estás seguro de eliminar esta foto?
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleDeletePhoto}
            >
              <Text style={styles.modalButtonText}>Eliminar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: "#ddd" }]}
              onPress={() => setDeleteModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Cambiar foto de perfil</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleSelectPhoto}
            >
              <Text style={styles.modalButtonText}>Seleccionar nueva foto</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: "#ddd" }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: "#2196F3",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  modalButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});
