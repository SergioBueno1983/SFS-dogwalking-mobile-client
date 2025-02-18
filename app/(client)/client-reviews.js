import { ScrollView } from "react-native";
import { Screen } from "../../src/components/Screen";
import ShowReviews from "../../src/components/reviews/ShowReviews";


export default function ClientReviews() {
  return (
    <ScrollView>
      <Screen>
        <ShowReviews />
      </Screen>
    </ScrollView>
  );
}
