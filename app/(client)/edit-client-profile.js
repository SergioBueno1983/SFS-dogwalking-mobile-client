import { ScrollView } from "react-native";
import { Screen } from "../../src/components/Screen";
import EditProfile from "../../src/components/client/EditProfile.";

export default function EditClientProfile() {
  return (
    <ScrollView>
      <Screen>
        <EditProfile />
      </Screen>
    </ScrollView>
  );
}
