import React, { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { useUserLog } from "../contexts/UserLogContext";
import { useRouter } from "expo-router";
import { getToken } from "../utils/authStorage";

export default function MpSuccessAssociation({ code }) {
  const { userLog, setUserLog } = useUserLog();
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);

  const successAsociation = async (code) => {
    try {
      const token = await getToken();

      const response = await fetch(
        `http://localhost:3001/api/v1/walkers/mercadopago/${userLog.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            code: code,
          }),
        },
      );

      if (response.ok) {
        // Actualiza campo mercadopago en userLog
        setUserLog((prevUserLog) => ({
          ...prevUserLog,
          mercadopago: true,
        }));

        setLoading(false);

        // Espera 3 segundos antes de hacer el router.replace
        // eslint-disable-next-line no-undef
        setTimeout(() => {
          router.replace("/profile");
        }, 3000); // 3000 ms = 3 segundos
      } else {
        console.error("Error al actualizar mercadopago");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };

  useEffect(() => {
    successAsociation(code);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <View>
      <Text>
        ¡Tu cuenta de MercadoPago se asoció correctamente! Te estamos
        redireccionando...
      </Text>
    </View>
  );
}
