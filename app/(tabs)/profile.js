import { ScrollView, Text } from "react-native";
import { Screen } from "../../src/components/Screen";
import ClientProfile from "../../src/components/client/ClientProfile";

export default function Profile() {


  return (
    <ScrollView>
      <Screen>
        <ClientProfile />
      </Screen>
    </ScrollView>
  );
}
