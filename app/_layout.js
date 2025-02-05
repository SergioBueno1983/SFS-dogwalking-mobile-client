import { Text, View, StyleSheet, Alert } from "react-native";
import * as Linking from "expo-linking";
import { Stack, Slot } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { UserLogProvider } from "../src/contexts/UserLogContext";
import { ServicesProvider } from "../src/contexts/ServicesContext";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { useRouter } from "expo-router";
import { WebSocketProvider } from "../src/contexts/WebSocketContext";
import { ChatsProvider } from "../src/contexts/ChatContext";
import { NotificationsProvider } from "../src/contexts/NotificationsContext";
import Notifications from "../src/components/Notifications";
import { Provider as PaperProvider } from "react-native-paper";
import ChatList from "../src/components/ChatList";
import { useUserLog } from "../src/contexts/UserLogContext";
import { ShowHeadreToolsProvider } from "../src/contexts/ShowHeaderToolsContext";

export default function Layout() {
  const router = useRouter();

  useEffect(() => {
    // Función para manejar el deep link cuando la app ya está corriendo
    const handleDeepLink = (event) => {
      const url = event.url;
      // Aquí extraes la ruta de la URL
      const path = url.replace("SFS-dogwalking://", "");

      // Realizas la navegación a la ruta correspondiente
      router.push(`/${path}`);
    };

    // Primero, maneja la URL inicial si la app se abrió desde un deep link
    const checkInitialUrl = async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        // Extracción de la parte relevante de la URL (en este caso, 'service/1')
        const path = initialUrl.replace("SFS-dogwalking://", "");

        // Realizar la navegación hacia esa ruta
        router.push(`/${path}`);
      }
    };

    // Llamar a la función para verificar la URL inicial
    checkInitialUrl();

    // Registrar el listener de deep link
    const subscription = Linking.addEventListener("url", handleDeepLink);

    // Limpiar el listener cuando el componente se desmonte
    return () => {
      subscription.remove();
    };
  }, [router]);

  return (
    <>
      <StatusBar style="auto" />
      <View style={styles.container}>
        <SafeAreaProvider>
          <PaperProvider>
            <UserLogProvider>
              <Content />
            </UserLogProvider>
          </PaperProvider>
        </SafeAreaProvider>
      </View>
    </>
  );
}

function Content() {
  const { userLog } = useUserLog(); // Ahora se usa dentro del UserLogProvider

  return (
    <WebSocketProvider>
      <ChatsProvider>
        <NotificationsProvider>
          <ShowHeadreToolsProvider>
            <ServicesProvider>
              <Stack
                screenOptions={{
                  headerRight: () =>
                    userLog ? (
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "flex-end",
                          gap: 0,
                        }}
                      >
                        <ChatList style={{ padding: 10 }} />
                        <Notifications style={{ padding: 10 }} />
                      </View>
                    ) : null,
                  headerTitle: "",
                }}
              >
                <Stack.Screen
                  name="chat/[walkerId]"
                  options={{
                    headerRight: () => null,
                  }}
                />
              </Stack>
            </ServicesProvider>
          </ShowHeadreToolsProvider>  
        </NotificationsProvider>
      </ChatsProvider>
    </WebSocketProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
