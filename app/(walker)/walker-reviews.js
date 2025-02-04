import { ScrollView } from "react-native";
import { Screen } from "../../src/components/Screen";
import ShowWalkerReviews from "../../src/components/walker/ShowWalkerReviews";

export default function WalkerReviews() {
  return (
    <ScrollView>
      <Screen>
        <ShowWalkerReviews />
      </Screen>
    </ScrollView>
  );
}
