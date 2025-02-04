import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { RegisterForm } from "./src/components/RegisterForm";
import { LoginForm } from "./src/components/LoginForm";

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <RegisterForm />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
