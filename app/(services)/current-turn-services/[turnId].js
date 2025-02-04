import { ScrollView } from "react-native";
import TurnServices from "../../../src/components/services/TurnServices";
import { Screen } from "../../../src/components/Screen";
import { useLocalSearchParams } from "expo-router";

export default function CurrentTurnServices() {
  const { turnId } = useLocalSearchParams();

  return (
    <ScrollView>
      <Screen>
        <TurnServices turnId={turnId} />
      </Screen>
    </ScrollView>
  );
}
