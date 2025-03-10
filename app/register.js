import { RegisterForm } from "../src/components/RegisterForm";
import { Screen } from "../src/components/Screen";
import { ScrollView } from "react-native";

export default function Register() {
  return (
    <ScrollView>
      <Screen />
        <RegisterForm />
      <Screen />
    </ScrollView>
)
}
