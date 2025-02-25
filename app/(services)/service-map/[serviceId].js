import { Screen } from "../../../src/components/Screen";
import { useLocalSearchParams } from "expo-router";
import { ScrollView } from "react-native";
import OpenStreetMapComponent from "../../../src/components/OpenStreetMapComponent";

export default function ServiceMapPage() {
  const { serviceId } = useLocalSearchParams();
  return (
      <Screen>
        <OpenStreetMapComponent serviceId={serviceId} />
      </Screen>
  );
}
