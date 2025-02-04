import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useUserLog } from "../../contexts/UserLogContext";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { getToken } from "../../utils/authStorage";
import globalConstants from "../../const/globalConstants";

export default function AddPhotos() {
  const { userLog, setUserLog } = useUserLog();
  const router = useRouter();

  const handleSelectPhoto = async () => {
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
      formData.append("imagenPaseador", {
        uri: localUri,
        name: `${userLog.nombre_usuario}.jpg`, // Nombre del archivo
        type: "image/jpeg", // Tipo MIME
      });

      try {
        const token = await getToken();
        const fetchUrl = `${globalConstants.URL_BASE}/image/walker/single/${userLog.id}`;

        const response = await fetch(fetchUrl, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`, // Si tu API requiere autenticación
          },
          body: formData,
        });

        const data = await response.json();
        if (data.ok) {
          setUserLog((prevUserLog) => ({
            ...prevUserLog,
            fotos: [
              ...(prevUserLog.fotos || []),
              { url: data.newImage.url }, // Agrega un objeto con la propiedad "url"
            ],
          }));
          alert("Imagen subida exitosamente");
          router.back();
        } else {
          alert("Error al subir la imagen: " + data.message);
        }
      } catch (error) {
        console.error("Error al subir la imagen:", error);
        alert("Error al subir la imagen. Por favor, inténtalo de nuevo.");
      }
    }
  };

  return (
    <View style={styles.content}>
      <Text style={styles.title}>Subir foto</Text>
      <TouchableOpacity style={styles.button} onPress={handleSelectPhoto}>
        <Text style={styles.buttonText}>Seleccionar nueva foto</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  content: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#2196F3",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});
