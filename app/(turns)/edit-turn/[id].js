import { useEffect, useState } from "react";
import { Screen } from "../../../src/components/Screen";
import { EditTurnForm } from "../../../src/components/turns/EditTurn";
import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Text, ScrollView } from "react-native";
import globalConstants from "../../../src/const/globalConstants";
import { getToken } from "../../../src/utils/authStorage";

export default function EditTurnPage() {
  const { id } = useLocalSearchParams();
  const [turn, setTurn] = useState(null);

  //voy a buscar el turno a la api
  useEffect(() => {
    const fetchTurn = async () => {
      const apiUrl = `${globalConstants.URL_BASE}/turns/${id}`;
      const token = await getToken();
      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setTurn(data.body);
    };

    fetchTurn();
  }, [id]);

  if (!turn) {
    return (
      <Screen>
        <ActivityIndicator />
      </Screen>
    );
  }
  return (
    <ScrollView>
      <Screen>
        <EditTurnForm turn={turn} />
      </Screen>
    </ScrollView>
  );
}
