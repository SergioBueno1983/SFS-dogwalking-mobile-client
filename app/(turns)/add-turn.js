import { Screen } from "../../src/components/Screen";
import { AddTurnForm } from "../../src/components/turns/AddTurnForm";
import { ScrollView } from "react-native";

export default function AddTurnPage() {
  return (
    <ScrollView>
      <Screen>
        <AddTurnForm />
      </Screen>
    </ScrollView>
  );
}
