import { ScrollView, Text } from "react-native";
import { Screen } from "../../src/components/Screen";
import { useUserLog } from "../../src/contexts/UserLogContext";
import WalkerProfile from "../../src/components/walker/WalkerProfile";

export default function Profile() {
  const { userLog } = useUserLog();

  return (
    <ScrollView>
      <Screen>
        <WalkerProfile />
      </Screen>
    </ScrollView>
  );
}
