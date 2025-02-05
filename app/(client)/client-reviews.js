import { ScrollView } from "react-native";
import { Screen } from "../../src/components/Screen";
import ShowClientReviews from "../../src/components/client/ShowClientReviews";

export default function WalkerReviews() {
  return (
    <ScrollView>
      <Screen>
        <ShowClientReviews />
      </Screen>
    </ScrollView>
  );
}
