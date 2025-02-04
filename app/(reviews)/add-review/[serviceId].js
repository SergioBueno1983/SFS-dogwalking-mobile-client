import { AddReviewForm } from "../../../src/components/reviews/AddReview";
import { Screen } from "../../../src/components/Screen";
import { useLocalSearchParams } from "expo-router";
import { ScrollView } from "react-native";

export default function AddReviewPage() {
  const { serviceId } = useLocalSearchParams();
  return (
    <ScrollView>
      <Screen>
        <AddReviewForm serviceId={serviceId} />
      </Screen>
    </ScrollView>
  );
}
