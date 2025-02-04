import { ScrollView } from "react-native";
import { Screen } from "../../src/components/Screen";
import AddPhotos from "../../src/components/walker/AddPhotos";

export default function AddWalkerPhoto() {
  return (
    <ScrollView>
      <Screen>
        <AddPhotos />
      </Screen>
    </ScrollView>
  );
}
