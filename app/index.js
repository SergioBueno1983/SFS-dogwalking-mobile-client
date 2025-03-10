import { LoginForm } from "../src/components/LoginForm";
import { Screen } from "../src/components/Screen";
import { ScrollView } from "react-native";

export default function Index() {
  return (
    <ScrollView>
      <Screen />
        <LoginForm />
      <Screen />
    </ScrollView>
  )
}
