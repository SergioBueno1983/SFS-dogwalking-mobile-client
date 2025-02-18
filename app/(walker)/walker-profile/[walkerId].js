import { Screen } from "../../../src/components/Screen";
import { useLocalSearchParams } from "expo-router";
import { ScrollView } from "react-native";
import WalkerProfile from "../../../src/components/walkers/WalkerProfile";

export default function WalkerProfilePage() {
  const { walkerId } = useLocalSearchParams();
  return (
    <ScrollView>
      <Screen>
        <WalkerProfile walkerId={walkerId} />
      </Screen>
    </ScrollView>
  );
}