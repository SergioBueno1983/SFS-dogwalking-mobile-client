import { ScrollView } from "react-native";
import { Screen } from "../../src/components/Screen";
import EditProfile from "../../src/components/walker/EditProfile.";

export default function EditWalkerProfile() {
  return (
    <ScrollView>
      <Screen>
        <EditProfile />
      </Screen>
    </ScrollView>
  );
}
