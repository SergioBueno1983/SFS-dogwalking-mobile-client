import { View, Text, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { Screen } from "../src/components/Screen";
import MpSuccessAssociation from "../src/components/MpSuccessAssociation";

export default function SuccessMpAssociation() {
  const { code } = useLocalSearchParams();

  return (
    <ScrollView>
      <Screen>
        {code ? (
          <MpSuccessAssociation code={code} />
        ) : (
          <Text>Hubo un error al asociar la cuenta</Text>
        )}
      </Screen>
    </ScrollView>
  );
}
