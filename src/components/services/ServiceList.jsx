import { ScrollView, Text } from "react-native";
import { Screen } from "../Screen";
import { ServiceCard } from "../cards/ServiceCard";

export default function ServiceListComponent({ services }) {
  return (
    <>
      {services.map((service) => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </>
  );
}
