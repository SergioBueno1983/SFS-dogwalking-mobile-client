import { ScrollView } from "react-native";
import { Screen } from "../../../src/components/Screen";
import ShowReviews from "../../../src/components/reviews/ShowReviews";
import { useLocalSearchParams } from "expo-router";


export default function WalkerReviews() {
  const { walkerId } = useLocalSearchParams();
  return (
    <ScrollView>
      <Screen>
        <ShowReviews walkerId={walkerId} />
      </Screen>
    </ScrollView>
  );
}
