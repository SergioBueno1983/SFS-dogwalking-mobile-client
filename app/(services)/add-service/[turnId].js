import { Screen } from "../../../src/components/Screen";
import { useLocalSearchParams } from "expo-router";
import { ScrollView } from "react-native";
import AddServiceForm from "../../../src/components/services/AddService";

export default function AddServicePage() {
  const { turnId } = useLocalSearchParams();
  return (
    <ScrollView>
      <Screen>
        <AddServiceForm turnId={turnId} />
      </Screen>
    </ScrollView>
  );
}
