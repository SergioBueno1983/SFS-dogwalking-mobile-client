import { useLocalSearchParams } from "expo-router";
import  ChatComponent  from "../../src/components/ChatComponent";
import { ScrollView } from "react-native";
import { Screen } from "../../src/components/Screen";

export default function ChatPage() {
  const { walkerId } = useLocalSearchParams();

  return (
    <ChatComponent walkerId={walkerId} />
  );
}