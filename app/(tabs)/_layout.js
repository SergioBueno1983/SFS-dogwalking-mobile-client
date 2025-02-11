import { Tabs } from "expo-router";
import { AntDesign } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: "lightblue" },
        tabBarActiveTintColor: "black",
      }}
    >
      <Tabs.Screen
        name="mainPage"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <AntDesign name="home" size={24} color="#000" />
          ),
        }}
      />
      <Tabs.Screen
        name="service-list"
        options={{
          title: "Servicios",
          tabBarIcon: ({ color }) => (
            <AntDesign name="profile" size={24} color="#000" />
          ),
        }}
      />
      <Tabs.Screen
        name="service-history"
        options={{
          title: "Historial",
          tabBarIcon: ({ color }) => (
            <AntDesign name="book" size={24} color="#000" />
          ),
        }}
      />

      <Tabs.Screen
        name="bills"
        options={{
          title: "Facturas",
          tabBarIcon: ({ color }) => (
            <AntDesign name="book" size={24} color="#000" />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color }) => (
            <AntDesign name="user" size={24} color="#000" />
          ),
        }}
      />
    </Tabs>
  );
}
